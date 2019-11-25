var Module = { // eslint-disable-line
  // we'll defer our execution until the wasm is ready to go, called by emscripten js
  onRuntimeInitialized() {
    window.wasmLoaded = true;
    window.wasmAdapter = Module;
    // const event = new Event('wasm_load');
    // document.dispatchEvent(event);

    const rect = new Module.Shape({
      x: 50, y: 60, width: 250, height: 10, color: 0xFF000000,
    });
  },
};
