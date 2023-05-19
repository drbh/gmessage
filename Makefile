.PHONY: run pnpm install backend

run: pnpm install compile backend

pnpm:
	if ! command -v pnpm &> /dev/null; then \
		curl -fsSL https://get.pnpm.io/install.sh | sh -; \
	fi

install: pnpm
	cd web && pnpm install

compile: build.flag

build.flag: $(shell find src -type f)
	cd web && pnpm build
	touch build.flag

backend: compile
	cd server && make
