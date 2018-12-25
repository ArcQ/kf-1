#kf-1

This is for a game.

This project utilizes cljs as the ui layer, and pixijs + js around the game engine, and rust-wasm for the game logic used in a manner that can be taken out and tested on very easily.

#Development
Everything compiles down into public/js, wasm modules are directly imported inside public/index.html.
Rust-wasm modules use wasm-bindgen --no-modules, use start-dev script inside of rust `/battle-rust` to start a watching compiling script.
Inside of project root, run `lein figwheel dev` to start figwheel server.

Currently, engine is using 'legacy' code using pixijs, js, + rxjs.

# kf1

A [re-frame](https://github.com/Day8/re-frame) application designed to ... well, that part is up to you.

## Development Mode

### Run application:

```
lein clean
lein figwheel dev
```

Figwheel will automatically push cljs changes to the browser.

Wait a bit, then browse to [http://localhost:3449](http://localhost:3449).

## Production Build


To compile clojurescript to javascript:

```
lein clean
lein cljsbuild once min
```
