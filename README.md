#kf-1

This is for a game.

This project utilizes reactjs as the ui layer, renders using a custom game-engine built around rxjs and pixjs rendering engine, and cpp-wasm for the game logic used in a manner that can be taken out and tested very easily.

This project utilizes cljs as the ui layer, and pixijs + js around the game engine, and rust-wasm for the game logic used in a manner that can be taken out and tested on very easily.

#Development
Everything compiles down into public/js, wasm modules are directly imported inside public/index.html.
Rust-wasm modules use wasm-bindgen --no-modules, use start-dev script inside of rust `/game-wasm` to start a watching compiling script.

Currently, engine is using 'legacy' code using pixijs, js, + rxjs.

To start up development, you need to run two processes, the ui layer and the wasm layer.

```
cd js
yarn
yarn start
```

```
cd cpp
make dev-wasm
```

This will open a development version in web.

Development version that auto pulls the webview and packages it into a mobile version coming soon.
