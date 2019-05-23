// the `wasm_bindgen` global is set to the exports of the Rust module
// const { greet } = wasm_bindgen;

// we'll defer our execution until the wasm is ready to go
function run() {
  window.wasmLoaded = true;
  const event = new Event('wasm_load');
  document.dispatchEvent(event);
  // greet('World');
}

wasm_bindgen('game-wasm/battle_rust_bg.wasm').then(run);
