package main

import (
	"fmt"
	"io"
	"net/http"
	"os"

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

// DownloadFile will download a url to a local file.
func DownloadFile(filepath string, url string, progressCallback func(s string) bool) error {
	// Create the file
	out, err := os.Create(filepath)
	if err != nil {
		return err
	}
	defer out.Close()

	// Get the data
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Create our progress reporter and pass it to be used alongside our writer
	counter := &WriteCounter{
		Total:    0,
		Callback: progressCallback,
	}
	_, err = io.Copy(out, io.TeeReader(resp.Body, counter))
	if err != nil {
		return err
	}

	// The progress use the same line so print a new line once it's finished
	fmt.Println()

	return nil
}

type WriteCounter struct {
	Total             uint64
	Callback          func(s string) bool
	LastBeforeEmitted uint64
}

func (wc *WriteCounter) Write(p []byte) (int, error) {
	n := len(p)
	wc.Total += uint64(n)

	// only every 1000 bytes
	if wc.Total > wc.LastBeforeEmitted+
		(10*100_000) {
		wc.Callback(fmt.Sprintf("%d", wc.Total))
		wc.LastBeforeEmitted = wc.Total
	}

	return n, nil
}
