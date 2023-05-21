package main

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/getlantern/systray"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/mattn/go-sqlite3"
)

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
	PORT            = "10999"
	DB              = ".cache/gmessage/database.db"
	MODEL           = ".cache/gpt4all/ggml-mpt-7b-chat.bin"
	DEV_VERBOSE     = false
	ALLOWED_ORIGINS = "http://localhost:5190, http://127.0.0.1:8080"
)

// get the home directory
var home, _ = os.UserHomeDir()

func SystemStartup() {
	// make sure that .cache/gmessage exists
	os.MkdirAll(home+"/.cache/gmessage", os.ModePerm)
}

// struct for model information
type ModelInfo struct {
	Model        string `json:"model"`
	LastModified string `json:"last_modified"`
	Size         int    `json:"size"`
}

func main() {
	// ensure folders are created
	SystemStartup()

	if len(os.Args) > 1 {
		fmt.Println("Opening browser", os.Args[1])
		Standalone()
		return
	}

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     ALLOWED_ORIGINS,
		AllowCredentials: true,
	}))

	db := InitDb()

	// always start server in background
	go func() {
		RunServer(home, app, &db)
	}()

	// always start menu app
	systray.Run(OnReady, OnExit)

	app.Shutdown()

}
