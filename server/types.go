package main

import "time"

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

type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type CompletionMessage struct {
	ChatID   int           `json:"chat_id"`
	Messages []ChatMessage `json:"messages"`
}

type CompletionResponse struct {
	ID      string   `json:"id"`
	Object  string   `json:"object"`
	Model   string   `json:"model"`
	Usage   Usage    `json:"usage"`
	Choices []Choice `json:"choices"`
}

type Usage struct {
	PromptTokens int `json:"prompt_tokens"`

	CompletionTokens int `json:"completion_tokens"`

	TotalTokens int `json:"total_tokens"`
}

type Choice struct {
	Message      ChatMessage `json:"message"`
	FinishReason string      `json:"finish_reason"`
	Index        int         `json:"index"`
}
