(function() {
    var wasm;
    const __exports = {};


    const __wbg_log_722bff039eebdf61_target = console.log;

    __exports.__wbg_log_722bff039eebdf61 = function(arg0) {
        __wbg_log_722bff039eebdf61_target(arg0);
    };

    const stack = [];

    function addBorrowedObject(obj) {
        stack.push(obj);
        return ((stack.length - 1) << 1) | 1;
    }

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
    * @param {any} arg0
    * @returns {void}
    */
    __exports.level_one_dealloc = function(arg0) {
        try {
            return wasm.level_one_dealloc(addBorrowedObject(arg0));

        } finally {
            stack.pop();

        }

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
        * @param {any} arg0
        * @returns {}
        */
        constructor(arg0) {
            try {
                this.ptr = wasm.levelone_new(addBorrowedObject(arg0));

            } finally {
                stack.pop();

            }

        }
        /**
        * @param {number} arg0
        * @param {Uint16Array} arg1
        * @returns {void}
        */
        get_update(arg0, arg1) {
            const [ptr1, len1] = passArray16ToWasm(arg1);
            try {
                return wasm.levelone_get_update(this.ptr, arg0, ptr1, len1);

            } finally {
                wasm.__wbindgen_free(ptr1, len1 * 2);

            }

        }
    }
    __exports.LevelOne = LevelOne;

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
