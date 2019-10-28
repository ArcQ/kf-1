.PHONY: build

build-dev:
	rm -rf build
	mkdir build
	# emcc ./src/Game.cpp --bind --std=c++11 --source-map-base localhost:3000 -O0 -g4 -s WASM=1 -o build/test-wasm.js
	emcc ./src/Game.cpp --bind --std=c++11 -s WASM=1 -o build/test-wasm.html
	rm -rf ../js/public/test-wasm
	cp -rf build ../js/public/test-wasm

build-prod:
	rm -rf build
	mkdir build
	em++ ./src/GameWasm.cpp -O3 -s WASM=1 -o ./build/test-wasm.js
