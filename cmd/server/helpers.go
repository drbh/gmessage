package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	gpt4all "github.com/nomic-ai/gpt4all/gpt4all-bindings/golang"
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

// ReadFilesInDirectory reads files in a directory
func ReadFilesInDirectory(directoryPath string) ([]os.FileInfo, error) {
	files, err := ioutil.ReadDir(directoryPath)
	if err != nil {
		return nil, err
	}
	return files, nil
}

// BuildModelInfo builds model info
func BuildModelInfo(files []os.FileInfo) []ModelInfo {
	var models []ModelInfo
	for _, f := range files {
		info := ModelInfo{
			Model:        f.Name(),
			LastModified: f.ModTime().Format("2006-01-02 15:04:05"),
			Size:         int(f.Size()),
		}
		models = append(models, info)
	}
	return models
}

// DetermineModelType determines the model type
func DetermineModelType(model string) gpt4all.ModelType {
	if strings.Contains(model, "llama") {
		return gpt4all.LLaMAType
	} else if strings.Contains(model, "gpt4all-j") {
		return gpt4all.GPTJType
	} else if strings.Contains(model, "wizardLM") {
		return gpt4all.LLaMAType
	}
	return gpt4all.MPTType
}

// LoadModel loads a model
func LoadModel(path string, modelType gpt4all.ModelType, nThreads int) (*gpt4all.Model, error) {
	l, err := gpt4all.New(path, gpt4all.SetModelType(modelType), gpt4all.SetThreads(nThreads))
	if err != nil {
		return nil, err
	}
	return l, nil
}

// UnmarshalRequestBody unmarshals the request body
func UnmarshalRequestBody(c *fiber.Ctx, data interface{}) error {
	err := json.Unmarshal(c.Body(), &data)
	if err != nil {
		return err
	}
	return nil
}

// SendErrorResponse sends an error response
func SendErrorResponse(c *fiber.Ctx, statusCode int, message string) error {
	return c.Status(statusCode).SendString(message)
}

// PrintErrorAndReturnAsJSON prints an error and returns it as JSON
func PrintErrorAndReturnAsJSON(c *fiber.Ctx, err error) error {
	fmt.Println(err)
	return c.JSON(err)
}

// SendAsFileType sends a file as a specific content type
func SendAsFileType(c *fiber.Ctx, file string, contentType string) error {
	c.Set(fiber.HeaderContentType, contentType)
	return c.SendString(file)
}

// FileContentTypeMapping maps file extensions to content types
func FileContentTypeMapping(c *fiber.Ctx, file string) error {
	contentTypeMap := map[string]string{
		".html": "text/html",
		".js":   "text/javascript",
		".css":  "text/css",
	}

	for extension, contentType := range contentTypeMap {
		if strings.HasSuffix(c.Path(), extension) {
			return SendAsFileType(c, file, contentType)
		}
	}

	return c.SendString(file)
}

// PredictModelResponse predicts a response from a model
func PredictModelResponse(model *gpt4all.Model, prompt string, config ChatCompletionConfig, w *bufio.Writer) (string, error) {
	// send a static message if in test mode
	if os.Getenv("TEST_ENV") == "true" {
		staticMessage := `Hello, this is a test message.`
		// send the static message in chunks
		for _, char := range staticMessage {
			fmt.Fprintf(w, "{\"text\": \"%s\"}\r\n", string(char))
			w.Flush()
			// sleep 1/100 second
			time.Sleep(10 * time.Millisecond)
		}
		// short delay
		time.Sleep(100 * time.Millisecond)
		return staticMessage, nil
	}

	// stream incremental responses to the input writer
	model.SetTokenCallback(func(s string) bool {
		fmt.Fprintf(w, "{\"text\": \"%s\"}\r\n", s)
		w.Flush()
		return true
	})

	// execute the model
	resp, err := model.Predict(prompt,
		gpt4all.SetTokens(config.TokensSize),
		gpt4all.SetRepeatLastN(config.NPast),
		gpt4all.SetTemperature(config.Temp),
		gpt4all.SetTopP(config.TopP),
		gpt4all.SetTopK(config.TopK),
		gpt4all.SetRepeatPenalty(config.RepeatPenalty),
		gpt4all.SetContextErase(config.ContextErase),
	)

	return resp, err
}
