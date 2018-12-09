(function() {
    var wasm;
    const __exports = {};


    const __wbg_update_f293655a2c60af1d_target = (typeof cljs_wasm_adapter === 'undefined' ? null : cljs_wasm_adapter.update || function() {
        throw new Error(`wasm-bindgen: cljs_wasm_adapter.update does not exist`);
    }).bind(cljs_wasm_adapter);

    __exports.__wbg_update_f293655a2c60af1d = function(arg0) {
        __wbg_update_f293655a2c60af1d_target(arg0);
    };

    const __wbg_log_722bff039eebdf61_target = console.log;

    __exports.__wbg_log_722bff039eebdf61 = function(arg0) {
        __wbg_log_722bff039eebdf61_target(arg0);
    };

    const __wbg_log_306a05c00c31d850_target = console.log;

    __exports.__wbg_log_306a05c00c31d850 = function(arg0) {
        __wbg_log_306a05c00c31d850_target(arg0);
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
    * @returns {void}
    */
    __exports.level_one_dealloc = function() {
        return wasm.level_one_dealloc();
    };

    const __wbg_map_aaf35a6fe1dabfdf_target = typeof Array === 'undefined' ? null : Array.prototype.map || function() {
        throw new Error(`wasm-bindgen: Array.map does not exist`);
    };

    const slab = [{ obj: undefined }, { obj: null }, { obj: true }, { obj: false }];

    function getObject(idx) {
        if ((idx & 1) === 1) {
            return stack[idx >> 1];
        } else {
            const val = slab[idx >> 1];

            return val.obj;

        }
    }

    let slab_next = slab.length;

    function addHeapObject(obj) {
        if (slab_next === slab.length) slab.push(slab.length + 1);
        const idx = slab_next;
        const next = slab[idx];

        slab_next = next;

        slab[idx] = { obj, cnt: 1 };
        return idx << 1;
    }

    function dropRef(idx) {

        idx = idx >> 1;
        if (idx < 4) return;
        let obj = slab[idx];

        obj.cnt -= 1;
        if (obj.cnt > 0) return;

        // If we hit 0 then free up our space in the slab
        slab[idx] = slab_next;
        slab_next = idx;
    }

    function takeObject(idx) {
        const ret = getObject(idx);
        dropRef(idx);
        return ret;
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

    __exports.__wbg_map_aaf35a6fe1dabfdf = function(arg0, arg1) {
        let cbarg1 = function(arg0, arg1, arg2) {
            let a = this.a;
            this.a = 0;
            try {
                return takeObject(this.f(a, this.b, addHeapObject(arg0), arg1, addHeapObject(arg2)));

            } finally {
                this.a = a;

            }

        };
        cbarg1.f = wasm.__wbg_function_table.get(arg1);
        cbarg1.a = getGlobalArgument(0);
        cbarg1.b = getGlobalArgument(0 + 1);
        try {
            return addHeapObject(__wbg_map_aaf35a6fe1dabfdf_target.call(getObject(arg0), cbarg1.bind(cbarg1)));
        } finally {
            cbarg1.a = cbarg1.b = 0;

        }
    };

    const __wbg_entries_836348822f11e2f9_target = (typeof Object === 'undefined' ? null : Object.entries || function() {
        throw new Error(`wasm-bindgen: Object.entries does not exist`);
    }).bind(Object);

    __exports.__wbg_entries_836348822f11e2f9 = function(arg0) {
        return addHeapObject(__wbg_entries_836348822f11e2f9_target(getObject(arg0)));
    };

    const __wbg_get_b5fa2669cbf91d6f_target = (typeof Reflect === 'undefined' ? null : Reflect.get || function() {
        throw new Error(`wasm-bindgen: Reflect.get does not exist`);
    }).bind(Reflect);

    __exports.__wbg_get_b5fa2669cbf91d6f = function(arg0, arg1, exnptr) {
        try {
            return addHeapObject(__wbg_get_b5fa2669cbf91d6f_target(getObject(arg0), getObject(arg1)));
        } catch (e) {
            const view = getUint32Memory();
            view[exnptr / 4] = 1;
            view[exnptr / 4 + 1] = addHeapObject(e);

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

    __exports.__wbindgen_object_clone_ref = function(idx) {
        // If this object is on the stack promote it to the heap.
        if ((idx & 1) === 1) return addHeapObject(getObject(idx));

        // Otherwise if the object is on the heap just bump the
        // refcount and move on
        const val = slab[idx >> 1];
        val.cnt += 1;
        return idx;
    };

    __exports.__wbindgen_object_drop_ref = function(i) {
        dropRef(i);
    };

    __exports.__wbindgen_number_new = function(i) {
        return addHeapObject(i);
    };

    let cachegetUint8Memory = null;
    function getUint8Memory() {
        if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory;
    }

    __exports.__wbindgen_number_get = function(n, invalid) {
        let obj = getObject(n);
        if (typeof(obj) === 'number') return obj;
        getUint8Memory()[invalid] = 1;
        return 0;
    };

    __exports.__wbindgen_is_null = function(idx) {
        return getObject(idx) === null ? 1 : 0;
    };

    __exports.__wbindgen_is_undefined = function(idx) {
        return getObject(idx) === undefined ? 1 : 0;
    };

    __exports.__wbindgen_boolean_get = function(i) {
        let v = getObject(i);
        if (typeof(v) === 'boolean') {
            return v ? 1 : 0;
        } else {
            return 2;
        }
    };

    __exports.__wbindgen_is_symbol = function(i) {
        return typeof(getObject(i)) === 'symbol' ? 1 : 0;
    };

    let cachedTextEncoder = new TextEncoder('utf-8');

    function passStringToWasm(arg) {

        const buf = cachedTextEncoder.encode(arg);
        const ptr = wasm.__wbindgen_malloc(buf.length);
        getUint8Memory().set(buf, ptr);
        return [ptr, buf.length];
    }

    __exports.__wbindgen_string_get = function(i, len_ptr) {
        let obj = getObject(i);
        if (typeof(obj) !== 'string') return 0;
        const [ptr, len] = passStringToWasm(obj);
        getUint32Memory()[len_ptr / 4] = len;
        return ptr;
    };

    let cachedTextDecoder = new TextDecoder('utf-8');

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
