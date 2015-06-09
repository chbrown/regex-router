BIN := node_modules/.bin
DTS := node/node mocha/mocha

all: index.js

type_declarations: $(DTS:%=type_declarations/DefinitelyTyped/%.d.ts)
type_declarations/DefinitelyTyped/%:
	mkdir -p $(@D)
	curl -s https://raw.githubusercontent.com/chbrown/DefinitelyTyped/master/$* > $@

$(BIN)/tsc $(BIN)/mocha:
	npm install

%.js: %.ts type_declarations $(BIN)/tsc
	$(BIN)/tsc -m commonjs -t ES5 $<

.PHONY: test
test: index.js $(BIN)/mocha
	$(BIN)/mocha test
