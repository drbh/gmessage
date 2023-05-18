export INCLUDE_PATH := $(shell pwd)/vendors/gpt4all-bindings/golang

# ⭐️ ENTRY POINT FROM README THIS RUNS ALL OF THE COMMANDS BELOW
run: submodule lib check build

# check if the model is downloaded if not download it
check:
	@if [ ! -f "ggml-mpt-7b-chat.bin" ]; then \
		echo "Need to download from https://gpt4all.io/models/ggml-mpt-7b-chat.bin"; \
		curl -LO https://gpt4all.io/models/ggml-mpt-7b-chat.bin; \
		echo "🌈 Downloaded"; \
		exit 0; \
	else \
		echo "🌈 Already downloaded"; \
		exit 0; \
	fi

# download the model
download:
	curl -LO https://gpt4all.io/models/ggml-mpt-7b-chat.bin

# get the gpt4all library and its dependency llama.cpp
submodule:
	@git submodule update --init --recursive

# build the gpt4all library (use the golang bindings)
lib:
	@cd vendors/gpt4all-bindings/golang && make libgpt4all.a

# run the standalone app
app:
	@C_INCLUDE_PATH=$(INCLUDE_PATH) LIBRARY_PATH=$(INCLUDE_PATH) go run main.go

# run with menu instead of standalone
menu:
	@C_INCLUDE_PATH=$(INCLUDE_PATH) LIBRARY_PATH=$(INCLUDE_PATH) go run main.go menu

# build the standalone app
build:
	@C_INCLUDE_PATH=$(INCLUDE_PATH) LIBRARY_PATH=$(INCLUDE_PATH) go build -o gmessage main.go
