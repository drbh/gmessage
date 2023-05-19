.PHONY: run pnpm install compile backend

run: pnpm install compile backend

pnpm:
	@if ! command -v pnpm &> /dev/null; then \
		curl -fsSL https://get.pnpm.io/install.sh | sh -; \
	fi

install: pnpm
	pnpm install

compile: install
	pnpm build

backend: compile
	cd server && make
