package main

import (
	"database/sql"

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

	err := app.Listen(":" + PORT)
	if err != nil {
		panic(err)
	}

}
