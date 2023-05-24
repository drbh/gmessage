package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	_ "github.com/mattn/go-sqlite3"
	gpt4all "github.com/nomic-ai/gpt4all/gpt4all-bindings/golang"
)

var db *sql.DB

var MODEL_CONFIG ModelConfig

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

var modelPointer **gpt4all.Model

// get the home directory
var home, _ = os.UserHomeDir()

func SystemStartup() {
	// make sure that .cache/gmessage exists
	os.MkdirAll(home+"/.cache/gmessage", os.ModePerm)
	os.MkdirAll(home+"/.cache/gpt4all", os.ModePerm)
}

// struct for model information
type ModelInfo struct {
	Model        string `json:"model"`
	LastModified string `json:"last_modified"`
	Size         int    `json:"size"`
}

func main() {
	// check if the gui binary exists
	exePath, err := os.Executable()
	if err != nil {
		log.Fatal(err)
	}

	exePath += "-gui"

	// exit app channel
	exitApp := make(chan bool)

	// Run the gui binary (menu and desktop apps)
	go func() {

		// check if execPath exists
		if _, err := os.Stat(exePath); os.IsNotExist(err) {
			fmt.Println("GUI binary not found, skipping...")
			return
		}

		cmd := exec.Command(exePath)
		output, err := cmd.CombinedOutput()
		if err != nil {
			log.Fatal(err)
		}

		fmt.Println(strings.TrimSpace(string(output)))

		// exit the program (outside of the goroutine)
		exitApp <- true
	}()

	// ensure folders are created
	SystemStartup()

	if len(os.Args) > 1 {
		fmt.Println("Opening browser", os.Args[1])
		// Standalone()
		return
	}

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     ALLOWED_ORIGINS,
		AllowCredentials: true,
	}))

	db = InitDb()

	go func() {
		RunServer(home, app)
	}()

	<-exitApp

	app.Shutdown()

}
