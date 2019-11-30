var Module = { // eslint-disable-line
  // we'll defer our execution until the wasm is ready to go, called by emscripten js
  onRuntimeInitialized() {
    window.wasmLoaded = true;
    window.wasmAdapter = Module;
    // const event = new Event('wasm_load');
    // document.dispatchEvent(event);

    const arr = new Float32Array([1.0, 2.0, 0.5]);
    const vec = new Module.CoderKeyMapping();
    for (let i = 0; i < arr.length; i++) {
      vec.push_back(arr[i]);
    }
    const obj = new Module.GameEnvAdapter(true, vec);
    console.log(obj);
    console.log(`obj.x is ${obj.x}`);
  },
};
