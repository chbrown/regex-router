BIN := node_modules/.bin

all: index.js index.d.ts

node_modules/%:
	mkdir -p $(@D)
	curl -s https://raw.githubusercontent.com/borisyankov/DefinitelyTyped/master/$* > $@

$(BIN)/tsc $(BIN)/mocha:
	npm install

index.js index.d.ts: index.ts node_modules/node/node.d.ts $(BIN)/tsc
	$(BIN)/tsc -d

test: index.js $(BIN)/mocha
	$(BIN)/mocha tests
