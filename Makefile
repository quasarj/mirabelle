.PHONY: default tags clean

default: serve

serve: node_modules
	pnpm run start

build: node_modules
	pnpm run build

node_modules: package.json
	pnpm i

tags: 
	ctags -R --languages=JavaScript,TypeScript --exclude=node_modules --exclude=build --exclude=dist

clean:
	rm -rf node_modules dist
