// The `--no-modules`-generated JS from `wasm-bindgen` attempts to use
// `WebAssembly.instantiateStreaming` to instantiate the wasm module,
// but this doesn't work with `file://` urls. This example is frequently
// viewed by simply opening `index.html` in a browser (with a `file://`
// url), so it would fail if we were to call this function!
//
// Work around this for now by deleting the function to ensure that the
// `no_modules.js` script doesn't have access to it. You won't need this
// hack when deploying over HTTP.
delete WebAssembly.instantiateStreaming;

window.game_config = {};
window.js_wasm_adapter = {
  update(arg) {
    window.game_config.update(arg);
  },
  mapEventsKeyDict(name) {
    window.game_config.mapEventsKeyDict(name);
  }
};
