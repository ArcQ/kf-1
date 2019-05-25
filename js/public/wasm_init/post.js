// the `wasm_bindgen` global is set to the exports of the Rust module
// we'll defer our execution until the wasm is ready to go
function run(mod) {
  window.wasm = mod;
  window.wasmLoaded = true;
  const event = new Event('wasm_load');
  document.dispatchEvent(event);
}

window.wasm_bindgen('game-wasm/battle_rust_bg.wasm').then(run);
