export INCLUDE_PATH := $(shell pwd)/server/vendors/gpt4all-bindings/golang
export MODEL_NAME := ggml-mpt-7b-chat.bin

.PHONY: all pnpm install compile package submodule lib check download app build

run: backend frontend

# ⭐️ ENTRY POINT FROM README THIS RUNS ALL OF THE COMMANDS BELOW
frontend: pnpm install compile
backend: submodule lib check build

#
# Frontend Related
#

pnpm:
	if ! command -v pnpm &> /dev/null; then \
		curl -fsSL https://get.pnpm.io/install.sh | sh -; \
	fi

install: pnpm
	cd web && pnpm install

compile: build.flag

build.flag: $(shell find web/src -type f)
	cd web && pnpm build
	touch build.flag

package:
	@go run macapp.go -assets bin/ -bin gmessage -icon ./media/icon.png -identifier com.drbh.gmessage -name "gmessage" -dmg "gmessage-tmp.dmg" -o .


#
# Backend Related
#

# get the gpt4all library and its dependency llama.cpp
submodule:
	@git submodule update --init --recursive

# build the gpt4all library (use the golang bindings)
lib:
	@cd server/vendors/gpt4all-bindings/golang && make libgpt4all.a

# Check if the model is downloaded; if not, download it
check:
	@if [ ! -d "$(HOME)/.cache/gpt4all" ]; then \
		echo "Need to create $(HOME)/.cache/gpt4all"; \
		mkdir -p "$(HOME)/.cache/gpt4all"; \
		echo "🌈 Created $(HOME)/.cache/gpt4all"; \
	fi
	@if [ ! -f "$(HOME)/.cache/gpt4all/$(MODEL_NAME)" ]; then \
		echo "Need to download from https://gpt4all.io/models/$(MODEL_NAME)"; \
		mkdir -p "$(HOME)/.cache/gpt4all"; \
		curl -LO https://gpt4all.io/models/$(MODEL_NAME) -o "$(HOME)/.cache/gpt4all/$(MODEL_NAME)"; \
		echo "🌈 Downloaded"; \
		exit 0; \
	else \
		echo "🌈 Already downloaded"; \
		exit 0; \
	fi

# download the model
download:
	curl -LO https://gpt4all.io/models/ggml-mpt-7b-chat.bin

# run the standalone app
app:
	@cd server && C_INCLUDE_PATH=$(INCLUDE_PATH) LIBRARY_PATH=$(INCLUDE_PATH) go run *.go

# build the standalone app
build:
	@cd server && C_INCLUDE_PATH=$(INCLUDE_PATH) LIBRARY_PATH=$(INCLUDE_PATH) go build -o ../bin/gmessage *.go
