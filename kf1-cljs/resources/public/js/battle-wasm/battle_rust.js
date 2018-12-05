(function() {
    var wasm;
    const __exports = {};


    const __wbg_update_f293655a2c60af1d_target = (typeof cljs_wasm_adapter === 'undefined' ? null : cljs_wasm_adapter.update || function() {
        throw new Error(`wasm-bindgen: cljs_wasm_adapter.update does not exist`);
    }).bind(cljs_wasm_adapter);

    __exports.__wbg_update_f293655a2c60af1d = function(arg0) {
        __wbg_update_f293655a2c60af1d_target(arg0);
    };

    const __wbg_log_c6a78ae4e9683470_target = console.log;

    let cachedTextDecoder = new TextDecoder('utf-8');

    let cachegetUint8Memory = null;
    function getUint8Memory() {
        if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory;
    }

    function getStringFromWasm(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
    }

    __exports.__wbg_log_c6a78ae4e9683470 = function(arg0, arg1) {
        let varg0 = getStringFromWasm(arg0, arg1);
        __wbg_log_c6a78ae4e9683470_target(varg0);
    };

    const __wbg_log_722bff039eebdf61_target = console.log;

    __exports.__wbg_log_722bff039eebdf61 = function(arg0) {
        __wbg_log_722bff039eebdf61_target(arg0);
    };

    const __wbg_mapEventsKeyDict_8ffe9fd897dfe9e4_target = (typeof cljs_wasm_adapter === 'undefined' ? null : cljs_wasm_adapter.mapEventsKeyDict || function() {
        throw new Error(`wasm-bindgen: cljs_wasm_adapter.mapEventsKeyDict does not exist`);
    }).bind(cljs_wasm_adapter);

    let cachedTextEncoder = new TextEncoder('utf-8');

    function passStringToWasm(arg) {

        const buf = cachedTextEncoder.encode(arg);
        const ptr = wasm.__wbindgen_malloc(buf.length);
        getUint8Memory().set(buf, ptr);
        return [ptr, buf.length];
    }

    let cachegetUint32Memory = null;
    function getUint32Memory() {
        if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
            cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
        }
        return cachegetUint32Memory;
    }

    let cachedGlobalArgumentPtr = null;
    function globalArgumentPtr() {
        if (cachedGlobalArgumentPtr === null) {
            cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
        }
        return cachedGlobalArgumentPtr;
    }

    function getGlobalArgument(arg) {
        const idx = globalArgumentPtr() / 4 + arg;
        return getUint32Memory()[idx];
    }

    __exports.__wbg_mapEventsKeyDict_8ffe9fd897dfe9e4 = function(arg0) {
        let cbarg0 = function(arg0, arg1) {
            const [ptr0, len0] = passStringToWasm(arg0);
            return this.f(this.a, this.b, ptr0, len0, arg1);
        };
        cbarg0.f = wasm.__wbg_function_table.get(arg0);
        cbarg0.a = getGlobalArgument(0);
        cbarg0.b = getGlobalArgument(0 + 1);
        try {
            __wbg_mapEventsKeyDict_8ffe9fd897dfe9e4_target(cbarg0.bind(cbarg0));
        } finally {
            cbarg0.a = cbarg0.b = 0;

        }
    };

    const __wbg_log_306a05c00c31d850_target = console.log;

    __exports.__wbg_log_306a05c00c31d850 = function(arg0) {
        __wbg_log_306a05c00c31d850_target(arg0);
    };

    let cachegetUint16Memory = null;
    function getUint16Memory() {
        if (cachegetUint16Memory === null || cachegetUint16Memory.buffer !== wasm.memory.buffer) {
            cachegetUint16Memory = new Uint16Array(wasm.memory.buffer);
        }
        return cachegetUint16Memory;
    }

    function passArray16ToWasm(arg) {
        const ptr = wasm.__wbindgen_malloc(arg.length * 2);
        getUint16Memory().set(arg, ptr / 2);
        return [ptr, arg.length];
    }
    /**
    * @returns {void}
    */
    __exports.level_one_dealloc = function() {
        return wasm.level_one_dealloc();
    };

    function freeLevelOne(ptr) {

        wasm.__wbg_levelone_free(ptr);
    }
    /**
    */
    class LevelOne {

        free() {
            const ptr = this.ptr;
            this.ptr = 0;
            freeLevelOne(ptr);
        }

        /**
        * @returns {}
        */
        constructor() {
            this.ptr = wasm.levelone_new();
        }
        /**
        * @param {number} arg0
        * @returns {void}
        */
        get_update(arg0) {
            return wasm.levelone_get_update(this.ptr, arg0);
        }
        /**
        * @param {Uint16Array} arg0
        * @returns {void}
        */
        on_event(arg0) {
            const [ptr0, len0] = passArray16ToWasm(arg0);
            try {
                return wasm.levelone_on_event(this.ptr, ptr0, len0);

            } finally {
                wasm.__wbindgen_free(ptr0, len0 * 2);

            }

        }
    }
    __exports.LevelOne = LevelOne;

    __exports.__wbindgen_throw = function(ptr, len) {
        throw new Error(getStringFromWasm(ptr, len));
    };

    function init(path_or_module) {
        let instantiation;
        const imports = { './battle_rust': __exports };
        if (path_or_module instanceof WebAssembly.Module) {
            instantiation = WebAssembly.instantiate(path_or_module, imports);
        } else {
            const data = fetch(path_or_module);
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                instantiation = WebAssembly.instantiateStreaming(data, imports);
            } else {
                instantiation = data
                .then(response => response.arrayBuffer())
                .then(buffer => WebAssembly.instantiate(buffer, imports));
            }
        }
        return instantiation.then(({instance}) => {
            wasm = init.wasm = instance.exports;
            return;
        });
    };
    self.wasm_bindgen = Object.assign(init, __exports);
})();
