package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/gobuffalo/packr/v2"
	"github.com/gofiber/fiber/v2"
	gpt4all "github.com/nomic-ai/gpt4all/gpt4all-bindings/golang"
)

/*
 * Messages
 */
func SearchMessages(c *fiber.Ctx) error {
	text := c.Params("text")
	messages, err := db.SearchMessages(text)
	if err != nil {
		return PrintErrorAndReturnAsJSON(c, err)
	}
	return c.JSON(messages)
}

func GetChats(c *fiber.Ctx) error {
	chats, err := db.GetChats()
	if err != nil {
		return PrintErrorAndReturnAsJSON(c, err)
	}
	return c.JSON(chats)
}

func EditMessage(c *fiber.Ctx) error {
	messageID := c.Params("message_id")
	var update UpdateMessage
	err := UnmarshalRequestBody(c, &update)
	if err != nil {
		return SendErrorResponse(c, 400, err.Error())
	}
	err = db.EditMessage(messageID, update)
	if err != nil {
		panic(err)
	}
	return c.SendString("Message updated successfully.")
}

func GetMessages(c *fiber.Ctx) error {
	chatID := c.Params("chat_id")
	messages, err := db.GetMessages(chatID)
	if err != nil {
		return PrintErrorAndReturnAsJSON(c, err)
	}
	return c.JSON(messages)
}

/*
 * Models
 */
func GetSupportedModels(c *fiber.Ctx) error {
	// check if TEST_ENV is set to true and if so we don't download the model
	if os.Getenv("TEST_ENV") == "true" {
		return c.JSON(
			[]string{
				"jokept",
			},
		)
	}

	files, err := ReadFilesInDirectory(home + "/.cache/gpt4all")
	if err != nil {
		return SendErrorResponse(c, 400, fmt.Sprintf("Failed to read models: %s", err.Error()))
	}

	models := BuildModelInfo(files)
	return c.JSON(models)
}

// manage models
func DownloadModel(c *fiber.Ctx) error {
	// check if TEST_ENV is set to true and if so we don't download the model
	if os.Getenv("TEST_ENV") == "true" {
		return c.JSON(fiber.Map{
			"message": "TEST_ENV is set to true, not downloading the model",
		})
	}

	// read :model_name from the request params
	modelName := c.Params("model_name")
	modelUrl := "https://gpt4all.io/models/" + modelName
	filePath := home + "/.cache/gpt4all/" + modelName
	log.Println("Downloading model from", modelUrl, "to", filePath)

	c.Set(fiber.HeaderContentType, "text/event-stream")
	c.Set(fiber.HeaderCacheControl, "no-cache")
	c.Set(fiber.HeaderConnection, "keep-alive")
	c.Context().Response.Header.SetCanonical([]byte("X-Accel-Buffering"), []byte("no"))
	c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
		DownloadFile(filePath, modelUrl, func(s string) bool {
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
	// check if TEST_ENV is set to true and if so we don't remove the model
	if os.Getenv("TEST_ENV") == "true" {
		return c.JSON(fiber.Map{
			"message": "TEST_ENV is set to true, not removing the model",
		})
	}

	// read :model_name from the request params
	modelName := c.Params("model_name")

	// ensure the model exists
	if _, err := os.Stat(home + "/.cache/gpt4all/" + modelName); os.IsNotExist(err) {
		return c.JSON("Model does not exist")
	}

	// model
	filePath := home + "/.cache/gpt4all/" + modelName

	log.Println("Removing model from", filePath)

	err := os.Remove(filePath)

	if err != nil {
		panic(err)
	}

	// send a response to the client
	return c.JSON(map[string]string{
		"removed": modelName,
	})
}

/*
 * Configurations
 */
func GetChatCompletionConfig(c *fiber.Ctx) error {
	return c.JSON(CHAT_COMPLETION_CONFIG)
}

func SetChatCompletionConfig(c *fiber.Ctx) error {
	if os.Getenv("TEST_ENV") == "true" {
		return c.JSON(fiber.Map{
			"message": "TEST_ENV is set to true, not using a real model.",
		})
	}

	var config ChatCompletionConfig
	err := UnmarshalRequestBody(c, &config)
	if err != nil {
		return SendErrorResponse(c, 400, err.Error())
	}
	CHAT_COMPLETION_CONFIG = config
	return c.JSON(CHAT_COMPLETION_CONFIG)
}

func GetModelConfig(c *fiber.Ctx) error {
	// if we are in our TEST_ENV then we will auto set the model
	if os.Getenv("TEST_ENV") == "true" {
		// set the model
		return c.JSON(fiber.Map{
			"model":    "jokept",
			"nthreads": strconv.Itoa(MODEL_CONFIG.NThreads),
		})
	}

	return c.JSON(MODEL_CONFIG)
}

func SetModelConfig(c *fiber.Ctx) error {
	if os.Getenv("TEST_ENV") == "true" {
		return c.JSON(fiber.Map{
			"message": "TEST_ENV is set to true, not using a real model.",
		})
	}

	var config ModelConfig
	err := UnmarshalRequestBody(c, &config)
	if err != nil {
		return c.Status(400).SendString(fmt.Sprintf("Failed to load the model: %s", err.Error()))
	}
	MODEL_CONFIG = config

	modelType := DetermineModelType(MODEL_CONFIG.Model)
	model := home + "/" + MODEL_CONFIG.Model
	if MODEL_CONFIG.NThreads == 0 {
		MODEL_CONFIG.NThreads = 1
	}

	modelPtr := c.Locals("modelPointer").(**gpt4all.Model)
	*modelPtr, err = LoadModel(model, modelType, MODEL_CONFIG.NThreads)
	if err != nil {
		return c.Status(400).SendString(fmt.Sprintf("Failed to load the model: %s", err.Error()))

	}

	SetModelConfigToDb(
		db.DB,
		// convert MODEL_CONFIG to map[string]string
		map[string]string{
			"model":    MODEL_CONFIG.Model,
			"nthreads": strconv.Itoa(MODEL_CONFIG.NThreads),
		},
	)

	return c.JSON(MODEL_CONFIG)
}

/*
 * Static
 */
func ServeStatic(c *fiber.Ctx) error {
	box := packr.New("StaticFiles", "../../web/build")
	file, err := box.FindString(c.Path())

	// if / send index.html
	if c.Path() == "/" {
		file, err = box.FindString("index.html")
		if err != nil {
			return c.SendStatus(fiber.StatusNotFound)
		}
		return SendAsFileType(c, file, "text/html")
	}

	if err != nil {
		return c.SendStatus(fiber.StatusNotFound)
	}

	return FileContentTypeMapping(c, file)
}

/*
 * Completion
 */
func StreamCompletion(c *fiber.Ctx) error {
	var input UserInput
	err := json.Unmarshal(c.Body(), &input)
	if err != nil {
		return c.Status(400).SendString(err.Error())
	}
	requestTime := time.Now()

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

	// TODO: fix this hacky type conversion by cleaning up the
	// types in the database queries
	chatIdString := strconv.FormatInt(int64(input.ChatID), 10)

	// check if its a new chat
	isNewChat := db.ChatExists(chatIdString)

	// if its a new chat, add all init messages to the db
	if !isNewChat {
		for _, message := range INIT_MESSAGES {

			err = db.InsertMessage(Message{
				Role:             message.Role,
				Content:          message.Content,
				ChatID:           input.ChatID,
				RequestTimestamp: requestTime,
			})

			if err != nil {
				return c.Status(500).SendString(err.Error())
			}
		}
	}

	// Insert the new messages into the database.
	for _, message := range response.Messages {
		err = db.InsertMessage(Message{
			Role:             message.Role,
			Content:          message.Content,
			ChatID:           input.ChatID,
			RequestTimestamp: requestTime,
		})

		if err != nil {
			return c.Status(500).SendString(err.Error())
		}
	}

	// get all of the messages for the chat
	messages, err := db.GetMessages(chatIdString)

	// convert messages to chat messages
	var chatMessages []ChatMessage
	for _, message := range messages {
		chatMessages = append(chatMessages, ChatMessage{
			Role:    message.Role,
			Content: message.Content,
		})
	}

	prompt := BuildPrompt(chatMessages, true, true)

	modelPtr := c.Locals("modelPointer").(**gpt4all.Model)

	c.Set(fiber.HeaderContentType, "text/event-stream")
	c.Set(fiber.HeaderCacheControl, "no-cache")
	c.Set(fiber.HeaderConnection, "keep-alive")
	c.Context().Response.Header.SetCanonical([]byte("X-Accel-Buffering"), []byte("no"))
	c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {

		// start sending the response
		resp, err := PredictModelResponse(
			*modelPtr,
			prompt,
			CHAT_COMPLETION_CONFIG,
			w,
		)
		if err != nil {
			return
		}

		// after the message is finalized add it to the db
		err = db.InsertMessage(Message{
			Role:             "assistant",
			Content:          resp,
			ChatID:           input.ChatID,
			RequestTimestamp: requestTime,
		})
		if err != nil {
			return
		}
	})

	return nil
}

/*
 * Completion JSON API
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

	// TODO: avoid passing an empty *bufio.Writer
	// allow user to request that the response be streamed
	w := bufio.NewWriter(c.Context().Response.BodyWriter())

	resp, err := PredictModelResponse(l, prompt, CHAT_COMPLETION_CONFIG, w)
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
