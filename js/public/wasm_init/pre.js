var Module = { //eslint-disable-line
  // eslint-disable-line
  // we'll defer our execution until the wasm is ready to go, called by emscripten js
  onRuntimeInitialized() {
    window.wasmLoaded = true;
    window.wasmAdapter = Module;
    const event = new Event('wasm_load');
    document.dispatchEvent(event);

    const arr = [
      'NO_CHANGE',
      'P1',
      'P2',
      'SET_CHAR_STATE',
      'SET_SPRITE_POS',
      'CHANGE_ORIENTATION',
      'MOVE',
      'IDLE',
      'STOP',
      'SPOT_ATTACK',
      'FINISH_SPOT_ATTACK',
    ];

    const vec = new Module.StringArray();
    for (let i = 0; i < arr.length; i++) {
      vec.push_back(arr[i]);
    }

    const chars = new Module.CharacterInitialConfig();
    chars.set('P1', {
      k: 'assasin',
      speed: 5,
      orientation: 'RIGHT',
      pos: [100, 100],
    });
    chars.set('P2', {
      k: 'knight',
      speed: 5,
      orientation: 'LEFT',
      pos: [200, 200],
    });


    const vecw = new Module.IntArray();
    const matrix = new Module.TwoDIntArray();
    vec.push_back(1);
    matrix.push_back(vecw);

    const initConfig = {
      map: {
        tileW: 33.72222222222222,
        tileH: 33.75,
        matrix,
      },
      chars,
    };

    const obj = new Module.GameEnvAdapter(true, vec, initConfig);

    window.game_config = {};
    window.js_wasm_adapter = {
      update(arg) {
        window.game_config.update(arg);
      },
      mapEventsKeyDict(name) {
        window.game_config.mapEventsKeyDict(name);
      },
    };
  },
};
