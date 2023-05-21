package main

import (
	"fmt"

	"github.com/webview/webview"
)

func BuildPrompt(messages []ChatMessage, defaultPromptHeader bool, defaultPromptFooter bool) string {
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
			userMessage := `
` + message.Content
			fullPrompt += userMessage
		}
		if message.Role == "assistant" {
			assistantMessage := `
### Response: ` + message.Content
			fullPrompt += assistantMessage
		}
	}

	if defaultPromptFooter {
		fullPrompt += `
### Response: `
	}

	if DEV_VERBOSE {
		fmt.Println("Full prompt:", fullPrompt)
	}

	return fullPrompt
}

// Desktop app
func Standalone() {
	w := webview.New(false)
	defer w.Destroy()
	w.SetTitle("gmessage")
	w.SetSize(1080, 820, webview.HintNone)
	w.Navigate(
		"http://" + "localhost" + ":" + PORT + "/",
	)
	w.Run()
}
