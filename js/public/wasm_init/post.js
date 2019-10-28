var Module = { // eslint-disable-line
  // we'll defer our execution until the wasm is ready to go, called by emscripten js
  onRuntimeInitialized() {
    window.wasmLoaded = true;
    window.wasmAdapter = Module;
    // const event = new Event('wasm_load');
    // document.dispatchEvent(event);

    const c = new Module.Counter(22);
    console.log(c.counter); // prints 22
    c.increase();
    console.log(c.counter); // prints 23
    console.log(c.squareCounter()); // prints 529
  },
};
