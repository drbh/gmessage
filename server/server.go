package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	gpt4all "github.com/nomic-ai/gpt4all/gpt4all-bindings/golang"
)

func RunServer(
	home string,
	app *fiber.App,
	db *sql.DB,
) {

	modelPointer = new(*gpt4all.Model)

	app.Use(func(c *fiber.Ctx) error {
		c.Locals("modelPointer", modelPointer)
		return c.Next()
	})

	// Route for getting model configuration
	app.Get("/model-config", GetModelConfig)
	// Route for updating model configuration
	app.Put("/model-config", SetModelConfig)
	// Route for getting supported models
	app.Get("/supported-models", GetSupportedModels)
	// Route for downloading a model
	app.Post("/model/:model_name", DownloadModel)
	// Route for removing a model
	app.Delete("/model/:model_name", RemoveModel)
	// Route for getting chat completion configuration
	app.Get("/chat-completion-config", GetChatCompletionConfig)
	// Route for updating chat completion configuration
	app.Put("/chat-completion-config", SetChatCompletionConfig)
	// Route for getting chats
	app.Get("/chats", GetChats)
	// Route for searching messages
	app.Get("/search/:text", SearchMessages)
	// Route for an ad-hoc request and response
	app.Post("/api/completions", CompletionApi)
	// Route for getting messages
	app.Get("/messages/:chat_id", GetMessages)
	// Route for updating a message
	app.Put("/edit-message/:message_id", EditMessage)
	// Route for chat
	app.Post("/stream", StreamCompletion)
	// route to serve our compiled frontend static files
	app.Get("*", ServeStatic)

	// read default model configuration from database
	modelConfig := GetModelConfigFromDb(db)
	fmt.Println("Model configuration:", modelConfig)

	// if model configuration is found in database, load the model
	if len(modelConfig) > 0 {

		// set MODEL_CONFIG global variable
		jsonOfModelConfig := modelConfig["model_config"]
		// parse jsonOfModelConfig to ModelConfig
		var modelConfigModelConfig ModelConfig
		json.Unmarshal([]byte(jsonOfModelConfig), &modelConfigModelConfig)
		fmt.Println("Model configuration:", modelConfigModelConfig)

		modelName := modelConfigModelConfig.Model
		modelPath := home + "/" + modelName

		shouldInitializeModel := true

		// check if model exists
		if _, err := os.Stat(modelPath); os.IsNotExist(err) {
			fmt.Println("Model does not exist:", modelPath)

			shouldInitializeModel = false
		}

		// if no model on disk skip loading model
		// TODO: this step is prone to error if a user interrupts the download
		// it may result in a malformed model and this step will panic
		if shouldInitializeModel {

			nThreads := 1 // modelConfig["n_threads"]
			modelType := gpt4all.MPTType

			fmt.Println("Model:", modelName)

			if strings.Contains(modelName, "llama") {
				modelType = gpt4all.LLaMAType
			} else if strings.Contains(modelName, "gpt4all-j") {
				modelType = gpt4all.GPTJType
			} else if strings.Contains(modelName, "wizardLM") {
				modelType = gpt4all.LLaMAType
			}

			l, err := gpt4all.New(modelPath,
				gpt4all.SetModelType(modelType),
				gpt4all.SetThreads(
					// convert to int
					int(nThreads),
				))
			if err != nil {
				fmt.Println("Error loading model:", err)
			} else {
				fmt.Println("Model loaded:", modelPath)
				*modelPointer = l
			}
		}
	}
	fmt.Println("Listening on port", PORT)
	err := app.Listen(":" + PORT)
	if err != nil {
		panic(err)
	}

}
