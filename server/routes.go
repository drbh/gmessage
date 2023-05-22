package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gobuffalo/packr/v2"
	"github.com/gofiber/fiber/v2"
	gpt4all "github.com/nomic-ai/gpt4all/gpt4all-bindings/golang"
)

/*
Get data from database
*/
func SearchMessages(c *fiber.Ctx) error {
	text := c.Params("text")
	rows, err := db.Query("SELECT * FROM messages WHERE content LIKE ?", "%"+text+"%")
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var message Message
		if err := rows.Scan(
			&message.ID,
			&message.Role,
			&message.Content,
			&message.ChatID,
			&message.RequestTimestamp,
			&message.Timestamp,
		); err != nil {
			return c.Status(500).SendString(err.Error())
		}
		messages = append(messages, message)
	}

	return c.JSON(messages)
}

func GetChats(c *fiber.Ctx) error {
	rows, err := db.Query("SELECT MAX(id), role, content, chat_id, request_timestamp, timestamp FROM messages GROUP BY chat_id")
	if err != nil {

		return c.Status(500).SendString(err.Error())
	}
	defer rows.Close()

	var chats []Message
	for rows.Next() {
		var message Message
		if err := rows.Scan(
			&message.ID,
			&message.Role,
			&message.Content,
			&message.ChatID,
			&message.RequestTimestamp,
			&message.Timestamp,
		); err != nil {
			return c.Status(500).SendString(err.Error())
		}
		chats = append(chats, message)
	}

	return c.JSON(chats)
}

func EditMessage(c *fiber.Ctx) error {
	messageID := c.Params("message_id")
	var update UpdateMessage
	err := json.Unmarshal(c.Body(), &update)
	if err != nil {
		return c.Status(400).SendString(err.Error())
	}

	_, err = db.Exec("UPDATE messages SET content = ? WHERE id = ?", update.Content, messageID)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}

	return c.SendString("Message updated successfully.")
}

func GetMessages(c *fiber.Ctx) error {
	chatID := c.Params("chat_id")
	rows, err := db.Query("SELECT * FROM messages WHERE chat_id = ?", chatID)
	if err != nil {
		return c.Status(500).SendString(err.Error())
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var message Message
		if err := rows.Scan(
			&message.ID,
			&message.Role,
			&message.Content,
			&message.ChatID,
			&message.RequestTimestamp,
			&message.Timestamp,
		); err != nil {
			return c.Status(500).SendString(err.Error())
		}
		messages = append(messages, message)
	}

	// if nil make it empty list
	if messages == nil {
		messages = []Message{}
	}

	return c.JSON(messages)
}

/*
Get local file system models
*/
func GetSupportedModels(c *fiber.Ctx) error {
	// read all files in ~/.cache/gpt4all
	files, err := ioutil.ReadDir(home + "/.cache/gpt4all")
	if err != nil {
		return c.Status(400).SendString(fmt.Sprintf("Failed to read models: %s", err.Error()))
	}

	var models []ModelInfo
	for _, f := range files {
		info := ModelInfo{
			Model:        f.Name(),
			LastModified: f.ModTime().Format("2006-01-02 15:04:05"),

			Size: int(f.Size()),
		}
		models = append(models, info)

	}

	return c.JSON(models)
}

/*
Start get and set global configurations
*/
func GetChatCompletionConfig(c *fiber.Ctx) error {
	return c.JSON(CHAT_COMPLETION_CONFIG)
}

func SetChatCompletionConfig(c *fiber.Ctx) error {
	var config ChatCompletionConfig
	err := json.Unmarshal(c.Body(), &config)
	if err != nil {
		return c.Status(400).SendString(err.Error())
	}
	CHAT_COMPLETION_CONFIG = config
	return c.JSON(CHAT_COMPLETION_CONFIG)
}

func GetModelConfig(c *fiber.Ctx) error {

	// configMap := GetModelConfigFromDb()
	// if configMap == nil {
	// 	return c.Status(400).SendString("Failed to load model config from db")
	// }

	// var config ModelConfig
	// config.Model = configMap["model"]

	return c.JSON(MODEL_CONFIG)
}

func SetModelConfig(c *fiber.Ctx) error {
	var config ModelConfig
	err := json.Unmarshal(c.Body(), &config)
	if err != nil {
		return c.Status(400).SendString(fmt.Sprintf("Failed to load the model: %s", err.Error()))
	}
	MODEL_CONFIG = config

	// switch on type if "mpt" or "llama" or "gptj" in name set accordingly
	modelType := gpt4all.MPTType

	fmt.Println("Model:", MODEL_CONFIG.Model)

	if strings.Contains(MODEL_CONFIG.Model, "llama") {
		modelType = gpt4all.LLaMAType
	} else if strings.Contains(MODEL_CONFIG.Model, "gpt4all-j") {
		modelType = gpt4all.GPTJType
	} else if strings.Contains(MODEL_CONFIG.Model, "wizardLM") {
		modelType = gpt4all.LLaMAType
	}

	// load the model
	model := home + "/" + MODEL_CONFIG.Model

	// if nthreads is 0 set it to 1
	if MODEL_CONFIG.NThreads == 0 {
		MODEL_CONFIG.NThreads = 1
	}

	l, err := gpt4all.New(model,
		gpt4all.SetModelType(modelType),
		gpt4all.SetThreads(MODEL_CONFIG.NThreads))
	if err != nil {
		return c.Status(400).SendString(fmt.Sprintf("Failed to load the model: %s", err.Error()))
	}

	modelPtr := c.Locals("modelPointer").(**gpt4all.Model)
	*modelPtr = l

	SetModelConfigToDb(
		db,
		// convert MODEL_CONFIG to map[string]string
		map[string]string{
			"model":    MODEL_CONFIG.Model,
			"nthreads": strconv.Itoa(MODEL_CONFIG.NThreads),
		},
	)

	fmt.Println("Model loaded successfully.")

	return c.JSON(MODEL_CONFIG)
}

/*
Catch all for static files
*/
func ServeStatic(c *fiber.Ctx) error {

	box := packr.New("StaticFiles", "../web/build")

	if DEV_VERBOSE {
		fmt.Println("Sever binary contains the following UI files:")
		for _, file := range box.List() {
			fmt.Println(file)
		}
	}

	file, err := box.FindString(c.Path())

	// if / send index.html
	if c.Path() == "/" {
		file, err = box.FindString("index.html")
		if err != nil {
			return c.SendStatus(fiber.StatusNotFound)
		}
		c.Set(fiber.HeaderContentType, "text/html")
		return c.SendString(file)
	}

	if err != nil {
		return c.SendStatus(fiber.StatusNotFound)
	}

	// if html send as html
	if strings.HasSuffix(c.Path(), ".html") {
		c.Set(fiber.HeaderContentType, "text/html")
		return c.SendString(file)
	}

	// if js send as js
	if strings.HasSuffix(c.Path(), ".js") {
		c.Set(fiber.HeaderContentType, "text/javascript")
		return c.SendString(file)
	}

	// if css send as css
	if strings.HasSuffix(c.Path(), ".css") {
		c.Set(fiber.HeaderContentType, "text/css")
		return c.SendString(file)
	}

	return c.SendString(file)
}

/*
Core API for chat app, stream of messages and completion
*/
func StreamCompletion(c *fiber.Ctx) error {
	var input UserInput
	err := json.Unmarshal(c.Body(), &input)
	if err != nil {
		return c.Status(400).SendString(err.Error())
	}

	// Implement your chat completion logic here and get the response.
	// For example:
	response := &ChatCompletionResponse{
		Messages: []Message{
			{
				Role:    "user",
				Content: input.Message,
				ChatID:  input.ChatID,
			},
		},
	}

	// check if its a new chat
	isNewChat := false
	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM messages WHERE chat_id = ?)", input.ChatID).Scan(&isNewChat)
	if err != nil {
		panic(err)
	}

	// if its a new chat, add all init messages to the db
	if !isNewChat {
		for _, message := range INIT_MESSAGES {

			_, err = db.Exec("INSERT INTO messages (role, content, chat_id) VALUES (?, ?, ?)", message.Role, message.Content, input.ChatID)
			if err != nil {
				panic(err)
			}
		}
	}

	// Insert the new messages into the database.
	for _, message := range response.Messages {
		_, err := db.Exec("INSERT INTO messages (role, content, chat_id) VALUES (?, ?, ?)", message.Role, message.Content, message.ChatID)
		if err != nil {
			return c.Status(500).SendString(err.Error())
		}
	}

	// get all of the messages for the chat
	chatRows, err := db.Query("SELECT role, content FROM messages WHERE chat_id = ?", input.ChatID)
	if err != nil {
		panic(err)
	}

	// build chatMessages from rows
	chatMessages := []ChatMessage{}
	for chatRows.Next() {
		var role string
		var content string
		err = chatRows.Scan(&role, &content)
		if err != nil {
			panic(err)
		}

		chatMessages = append(chatMessages, ChatMessage{
			Role:    role,
			Content: content,
		})
	}

	prompt := BuildPrompt(chatMessages, true, true)

	modelPtr := c.Locals("modelPointer").(**gpt4all.Model)

	fmt.Println("MODEL", modelPtr)

	l := *modelPtr

	fmt.Println("MODEL", l)

	c.Set(fiber.HeaderContentType, "text/event-stream")
	c.Set(fiber.HeaderCacheControl, "no-cache")
	c.Set(fiber.HeaderConnection, "keep-alive")
	c.Context().Response.Header.SetCanonical([]byte("X-Accel-Buffering"), []byte("no"))
	c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {

		l.SetTokenCallback(func(s string) bool {
			fmt.Print(s) // show output
			fmt.Fprintf(w, "{\"text\": \"%s\"}\r\n", s)
			w.Flush()

			return true
		})

		request_timestamp := time.Now().UnixNano() / int64(time.Millisecond)

		resp, err := l.Predict(prompt,

			gpt4all.SetTokens(CHAT_COMPLETION_CONFIG.TokensSize),
			gpt4all.SetRepeatLastN(CHAT_COMPLETION_CONFIG.NPast),
			gpt4all.SetTemperature(CHAT_COMPLETION_CONFIG.Temp),
			gpt4all.SetTopP(CHAT_COMPLETION_CONFIG.TopP),
			gpt4all.SetTopK(CHAT_COMPLETION_CONFIG.TopK),
			gpt4all.SetRepeatPenalty(CHAT_COMPLETION_CONFIG.RepeatPenalty),
			gpt4all.SetContextErase(CHAT_COMPLETION_CONFIG.ContextErase),
		)
		if err != nil {
			panic(err)
		}

		// Insert the messages into the database a mock assistant response.
		_, err = db.Exec("INSERT INTO messages (role, content, chat_id, request_timestamp) VALUES (?, ?, ?, ?)", "assistant", resp, input.ChatID, request_timestamp)
		if err != nil {
			panic(err)
		}

		rows, err := db.Query("SELECT * FROM messages WHERE chat_id = ?", input.ChatID)
		if err != nil {
			panic(err)
		}
		defer rows.Close()

		var messages []Message
		for rows.Next() {
			var message Message
			if err := rows.Scan(
				&message.ID,
				&message.Role,
				&message.Content,
				&message.ChatID,
				&message.RequestTimestamp,
				&message.Timestamp,
			); err != nil {
				panic(err)
			}
			messages = append(messages, message)
		}

	})

	return nil
}

/*
API interface similar to existing completion API's
*/
func CompletionApi(c *fiber.Ctx) error {
	// read the request body
	body := c.Body()

	var data CompletionMessage
	err := json.Unmarshal(body, &data)
	if err != nil {
		panic(err)
	}

	// build chatMessages from data.Messages
	chatMessages := []ChatMessage{}
	for _, message := range data.Messages {
		chatMessages = append(chatMessages, ChatMessage{
			Role:    message.Role,
			Content: message.Content,
		})
	}

	prompt := BuildPrompt(chatMessages, true, true)

	modelPtr := c.Locals("modelPointer").(**gpt4all.Model)

	l := *modelPtr

	l.SetTokenCallback(func(s string) bool {
		fmt.Print(s) // show the token
		return true
	})

	resp, err := l.Predict(prompt,
		gpt4all.SetTokens(CHAT_COMPLETION_CONFIG.TokensSize),
		gpt4all.SetRepeatLastN(CHAT_COMPLETION_CONFIG.NPast),
		gpt4all.SetTemperature(CHAT_COMPLETION_CONFIG.Temp),
		gpt4all.SetTopP(CHAT_COMPLETION_CONFIG.TopP),
		gpt4all.SetTopK(CHAT_COMPLETION_CONFIG.TopK),
		gpt4all.SetRepeatPenalty(CHAT_COMPLETION_CONFIG.RepeatPenalty),
		gpt4all.SetContextErase(CHAT_COMPLETION_CONFIG.ContextErase),
	)
	if err != nil {
		panic(err)
	}

	response := CompletionResponse{
		ID:     "cmpl-1",
		Object: "text_completion",
		Model:  "gpt4all:2020-05-03",
		Usage: Usage{
			PromptTokens:     0,
			CompletionTokens: 0,
			TotalTokens:      0,
		},
		Choices: []Choice{
			{
				Message: ChatMessage{
					Role:    "assistant",
					Content: resp,
				},
				FinishReason: "stop",
				Index:        0,
			},
		},
	}

	// send a response to the client
	return c.JSON(response)
}

// manage models

func DownloadModel(c *fiber.Ctx) error {
	// read :model_name from the request params
	modelName := c.Params("model_name")

	modelUrl := "https://gpt4all.io/models/" + modelName
	filePath := home + "/.cache/gpt4all/" + modelName

	fmt.Println("Model to download: " + modelUrl)

	c.Set(fiber.HeaderContentType, "text/event-stream")
	c.Set(fiber.HeaderCacheControl, "no-cache")
	c.Set(fiber.HeaderConnection, "keep-alive")
	c.Context().Response.Header.SetCanonical([]byte("X-Accel-Buffering"), []byte("no"))
	c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {

		DownloadFile(filePath, modelUrl, func(s string) bool {
			// fmt.Print(s) // show output
			fmt.Fprintf(w, "{\"progress\": \"%s\"}\r\n", s)
			w.Flush()
			return true
		})

		fmt.Fprintf(w, "{\"status\": \"%s\"}\r\n", "done")
		w.Flush()

		return
	})

	return nil

}

// remove the model (delete file from disk)
func RemoveModel(c *fiber.Ctx) error {
	// read :model_name from the request params
	modelName := c.Params("model_name")

	// ensure the model exists
	if _, err := os.Stat(home + "/.cache/gpt4all/" + modelName); os.IsNotExist(err) {
		return c.JSON("Model does not exist")
	}

	// model
	filePath := home + "/.cache/gpt4all/" + modelName

	fmt.Println("File to be removed: ", filePath)

	err := os.Remove(filePath)

	if err != nil {
		panic(err)
	}

	// send a response to the client
	return c.JSON(map[string]string{
		"removed": modelName,
	})
}
