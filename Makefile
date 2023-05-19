
run: pnpm install compile backend

pnpm:
	curl -fsSL https://get.pnpm.io/install.sh | sh -

install:
	pnpm install

compile:
	pnpm build

backend:
	cd server && make