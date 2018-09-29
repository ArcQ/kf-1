#kf-1

This is for a game.

This project utilizes cljs as the ui layer, and pixijs + js around the game engine, and rust-wasm for the game logic used in a manner that can be taken out and tested on very easily.

#Development
Everything compiles down into public/js, wasm modules are directly imported inside public/index.html.
Rust-wasm modules use wasm-bindgen --no-modules, use start-dev script inside of rust `/battle-rust` to start a watching compiling script.
Inside of project root, run `lein figwheel dev` to start figwheel server.

Currently, engine is using 'legacy' code using pixijs, js, + rxjs.
