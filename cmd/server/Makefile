export INCLUDE_PATH := $(shell pwd)/vendors/gpt4all-bindings/golang
export MODEL_NAME := ggml-mpt-7b-chat.bin

# run the server
app:
	@packr2 && C_INCLUDE_PATH=$(INCLUDE_PATH) LIBRARY_PATH=$(INCLUDE_PATH) go run *.go
