default: serve

serve: node_modules
	pnpm run start

build: node_modules
	pnpm run build

node_modules: package.json
	pnpm i

clean:
	rm -rf node_modules dist
