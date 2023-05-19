package main

import (
	"bufio"
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/mattn/go-sqlite3"
	"github.com/webview/webview"

	gpt4all "github.com/nomic-ai/gpt4all/gpt4all-bindings/golang"

	"github.com/getlantern/systray"
	"github.com/getlantern/systray/example/icon"
	"github.com/skratchdot/open-golang/open"
)

type ChatCompletionConfig struct {
	LogitsSize    int     `json:"logits_size"`
	TokensSize    int     `json:"tokens_size"`
	NPast         int     `json:"n_past"`
	NCtx          int     `json:"n_ctx"`
	NPredict      int     `json:"n_predict"`
	TopK          int     `json:"top_k"`
	TopP          float64 `json:"top_p"`
	Temp          float64 `json:"temp"`
	NBatch        int     `json:"n_batch"`
	RepeatPenalty float64 `json:"repeat_penalty"`
	RepeatLastN   int     `json:"repeat_last_n"`
	ContextErase  float64 `json:"context_erase"`
	Verbose       bool    `json:"verbose"`
}

type ModelConfig struct {
	Model    string `json:"model"`
	NThreads int    `json:"n_threads"`
}

type UpdateMessage struct {
	Content string `json:"content"`
}

type Message struct {
	ID               int       `json:"id"`
	Role             string    `json:"role"`
	Content          string    `json:"content"`
	ChatID           int       `json:"chat_id"`
	RequestTimestamp time.Time `json:"request_timestamp"`
	Timestamp        time.Time `json:"timestamp"`
}

type UserInput struct {
	Message string `json:"message"`
	ChatID  int    `json:"chat_id"`
}

type ChatCompletionResponse struct {
	Messages []Message `json:"messages"`
}

var db *sql.DB

var MODEL_CONFIG = ModelConfig{
	Model:    "ggml-mpt-7b-chat.bin",
	NThreads: 1,
}

var INIT_MESSAGES = []Message{
	Message{
		Role:    "system",
		Content: "You are a helpful assistant.",
	},
	Message{
		Role:    "user",
		Content: "Hello there.",
	},
	Message{
		Role:    "assistant",
		Content: "Hi, how can I help you?",
	},
}

var CHAT_COMPLETION_CONFIG = ChatCompletionConfig{
	LogitsSize:    0,
	TokensSize:    0,
	NPast:         0,
	NCtx:          0,
	NPredict:      200,
	TopK:          40,
	TopP:          0.9,
	Temp:          0.9,
	NBatch:        9,
	RepeatPenalty: 1.1,
	RepeatLastN:   64,
	ContextErase:  0.0,
	Verbose:       false,
}

const (
	PORT  = "10999"
	DB    = "./server/database.db"
	MODEL = ".cache/gpt4all/ggml-mpt-7b-chat.bin"
)

type ChatMessage struct {
	Role    string
	Content string
}

func buildPrompt(messages []ChatMessage, defaultPromptHeader bool, defaultPromptFooter bool) string {
	fullPrompt := ""
	for _, message := range messages {
		if message.Role == "system" {
			systemMessage := message.Content + "\n"
			fullPrompt += systemMessage
		}
	}

	if defaultPromptHeader {
		fullPrompt += `### Instruction: 
The prompt below is a question to answer, a task to complete, or a conversation 
to respond to; decide which and write an appropriate response.

### Prompt: `
	}

	for _, message := range messages {
		if message.Role == "user" {
			userMessage := "\n" + message.Content
			fullPrompt += userMessage
		}
		if message.Role == "assistant" {
			assistantMessage := `
### Response:
` + message.Content
			fullPrompt += assistantMessage
		}
	}

	if defaultPromptFooter {
		fullPrompt += `
### Response:
`
	}

	return fullPrompt
}

func main() {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5190, http://127.0.0.1:8080",
		AllowCredentials: true,
	}))

	// connect to the database
	var err error
	db, err = sql.Open("sqlite3", DB)
	if err != nil {
		panic(err)
	}

	// create table if not exists
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS messages (
		id integer PRIMARY KEY AUTOINCREMENT,
		role text NOT NULL,
		content text NOT NULL,
		chat_id integer NOT NULL,
		request_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);`)
	if err != nil {
		panic(err)
	}

	args := os.Args[1:]
	if len(args) > 0 {
		model := args[0]
		MODEL_CONFIG.Model = model
	}

	threads := 1

	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}

	model := home + "/" + MODEL

	l, err := gpt4all.New(model,
		gpt4all.SetModelType(gpt4all.MPTType),
		// gpt4all.SetModelType(gpt4all.LLaMAType),
		gpt4all.SetThreads(threads))

	defer l.Free()

	// serve sse.html
	app.Static("/sse", "./sse.html")

	app.Get("/stream", func(c *fiber.Ctx) error {
		c.Set(fiber.HeaderContentType, "text/event-stream")
		c.Set(fiber.HeaderCacheControl, "no-cache")
		c.Set(fiber.HeaderConnection, "keep-alive")
		c.Context().Response.Header.SetCanonical([]byte("X-Accel-Buffering"), []byte("no"))
		c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
			for i := 0; i < 10; i++ {
				fmt.Fprintf(w, "data: Message %d\n\n", i)
				w.Flush()
				time.Sleep(1 * time.Second)
			}
		})
		return nil
	})

	// Route for getting model configuration
	app.Get("/model-config", func(c *fiber.Ctx) error {
		return c.JSON(MODEL_CONFIG)
	})

	// Route for updating model configuration
	app.Put("/model-config", func(c *fiber.Ctx) error {
		var config ModelConfig
		err := json.Unmarshal(c.Body(), &config)
		if err != nil {
			return c.Status(400).SendString(fmt.Sprintf("Failed to load the model: %s", err.Error()))
		}
		MODEL_CONFIG = config
		return c.JSON(MODEL_CONFIG)
	})

	// Route for getting supported models
	app.Get("/supported-models", func(c *fiber.Ctx) error {
		return c.JSON([]string{
			"ggml-mpt-7b-chat.bin",
			"ggml-gpt4all-j-v1.3-groovy.bin",
		})
	})

	// Route for getting chat completion configuration
	app.Get("/chat-completion-config", func(c *fiber.Ctx) error {
		return c.JSON(CHAT_COMPLETION_CONFIG)
	})

	// Route for updating chat completion configuration
	app.Put("/chat-completion-config", func(c *fiber.Ctx) error {
		var config ChatCompletionConfig
		err := json.Unmarshal(c.Body(), &config)
		if err != nil {
			return c.Status(400).SendString(err.Error())
		}
		CHAT_COMPLETION_CONFIG = config
		return c.JSON(CHAT_COMPLETION_CONFIG)
	})

	// Route for chat
	app.Post("/message", func(c *fiber.Ctx) error {
		var input UserInput
		err := json.Unmarshal(c.Body(), &input)
		if err != nil {
			return c.Status(400).SendString(err.Error())
		}

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

		prompt := buildPrompt(chatMessages, true, true)

		l.SetTokenCallback(func(s string) bool {
			fmt.Print(s) // show output
			return true
		})

		resp, err := l.Predict(prompt, gpt4all.SetTemperature(0.1))
		if err != nil {
			panic(err)
		}

		// Insert the messages into the database a mock assistant response.
		_, err = db.Exec("INSERT INTO messages (role, content, chat_id) VALUES (?, ?, ?)", "assistant", resp, input.ChatID)
		if err != nil {
			return c.Status(500).SendString(err.Error())
		}

		rows, err := db.Query("SELECT * FROM messages WHERE chat_id = ?", input.ChatID)
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
	})

	// Route for chat
	app.Post("/stream", func(c *fiber.Ctx) error {
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

		prompt := buildPrompt(chatMessages, true, true)

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

			resp, err := l.Predict(prompt, gpt4all.SetTemperature(0.1))
			if err != nil {
				panic(err)
			}

			// Insert the messages into the database a mock assistant response.
			_, err = db.Exec("INSERT INTO messages (role, content, chat_id) VALUES (?, ?, ?)", "assistant", resp, input.ChatID)
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
	})

	// Route for an ad-hoc request and response
	app.Post("/hook", func(c *fiber.Ctx) error {
		// read the request body
		body := c.Body()

		// build prompt
		prompt := "Question:\n" + string(body) + "\nAnswer:\n"

		l.SetTokenCallback(func(s string) bool {
			fmt.Print(s) // show the token
			return true
		})

		resp, err := l.Predict(prompt, gpt4all.SetTemperature(0.1))
		if err != nil {
			panic(err)
		}

		// send a response to the client
		return c.SendString(resp)
	})

	app.Post("/stream-hook", func(c *fiber.Ctx) error {
		// read the request body
		body := c.Body()

		// build prompt
		prompt := "Question:\n" + string(body) + "\nAnswer:\n"

		c.Set(fiber.HeaderContentType, "text/event-stream")
		c.Set(fiber.HeaderCacheControl, "no-cache")
		c.Set(fiber.HeaderConnection, "keep-alive")
		c.Context().Response.Header.SetCanonical([]byte("X-Accel-Buffering"), []byte("no"))
		c.Context().SetBodyStreamWriter(func(w *bufio.Writer) {

			l.SetTokenCallback(func(s string) bool {
				fmt.Print(s) // show the response in the console
				fmt.Fprintf(w, "{\"text\": \"%s\"}\r\n", s)
				w.Flush()

				return true
			})

			_, err := l.Predict(prompt, gpt4all.SetTemperature(0.1))
			if err != nil {
				panic(err)
			}
		})

		return nil
	})

	// Route for getting messages
	app.Get("/messages/:chat_id", func(c *fiber.Ctx) error {
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
	})

	// Route for getting chats
	app.Get("/chats", func(c *fiber.Ctx) error {
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
	})

	// Route for searching messages
	app.Get("/search/:text", func(c *fiber.Ctx) error {
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
	})

	// Route for updating a message
	app.Put("/edit-message/:message_id", func(c *fiber.Ctx) error {
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
	})

	// serve static files in ../build
	app.Static("/", "build")

	// Start the Fiber server in a separate goroutine
	go func() {
		err := app.Listen(":" + PORT)
		if err != nil {
			panic(err)
		}
	}()

	// read from cli args
	menuApp := false
	if len(os.Args) > 1 {
		if os.Args[1] == "menu" {
			menuApp = true
		}
	}

	if menuApp {
		onExit := func() {
			fmt.Println("Exited")
		}

		systray.Run(onReady, onExit)
	} else {

		standalone()
	}
	// Wait for the webview app to exit
	app.Shutdown()

}

func standalone() {
	w := webview.New(false)
	defer w.Destroy()
	w.SetTitle("gmessage")
	w.SetSize(1080, 820, webview.HintNone)
	w.Navigate(
		"http://" + "localhost" + ":" + PORT + "/",
	)
	w.Run()
}

func onReady() {
	serverHost := "localhost"

	systray.SetTemplateIcon(icon.Data, icon.Data)
	systray.SetTitle("gmessage - Live")
	systray.SetTooltip("Server running on " + serverHost + ":" + PORT)

	mOpenUI := systray.AddMenuItem("Open UI", "Open the application interface")
	mQuit := systray.AddMenuItem("Quit", "Quit the whole app")

	go func() {
		for {
			select {
			case <-mOpenUI.ClickedCh:
				open.Run("http://" + serverHost + ":" + PORT)
			case <-mQuit.ClickedCh:
				systray.Quit()
				fmt.Println("Quit now...")
				return
			}
		}
	}()
}
