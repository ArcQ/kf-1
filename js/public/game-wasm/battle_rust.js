(function() {
    var wasm;
    const __exports = {};


    __exports.__wbg_update_ba264709a1d29d62 = function(arg0) {
        js_wasm_adapter.update(arg0);
    };

    const heap = new Array(32);

    heap.fill(undefined);

    heap.push(undefined, null, true, false);

    let stack_pointer = 32;

    function addBorrowedObject(obj) {
        if (stack_pointer == 1) throw new Error('out of js stack');
        heap[--stack_pointer] = obj;
        return stack_pointer;
    }

    let cachegetUint16Memory = null;
    function getUint16Memory() {
        if (cachegetUint16Memory === null || cachegetUint16Memory.buffer !== wasm.memory.buffer) {
            cachegetUint16Memory = new Uint16Array(wasm.memory.buffer);
        }
        return cachegetUint16Memory;
    }

    let WASM_VECTOR_LEN = 0;

    function passArray16ToWasm(arg) {
        const ptr = wasm.__wbindgen_malloc(arg.length * 2);
        getUint16Memory().set(arg, ptr / 2);
        WASM_VECTOR_LEN = arg.length;
        return ptr;
    }
    /**
    * @returns {void}
    */
    __exports.level_one_dealloc = function() {
        return wasm.level_one_dealloc();
    };

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

__exports.__wbg_from_17a73c6a0230169b = function(arg0) {
    return addHeapObject(Array.from(getObject(arg0)));
};

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

__exports.__wbg_map_294373a5ee228032 = function(arg0, arg1, arg2) {
    let cbarg1 = function(arg0, arg1, arg2) {
        let a = this.a;
        this.a = 0;
        try {
            return takeObject(this.f(a, this.b, addHeapObject(arg0), arg1, addHeapObject(arg2)));

        } finally {
            this.a = a;

        }

    };
    cbarg1.f = wasm.__wbg_function_table.get(177);
    cbarg1.a = arg1;
    cbarg1.b = arg2;
    try {
        return addHeapObject(getObject(arg0).map(cbarg1.bind(cbarg1)));
    } finally {
        cbarg1.a = cbarg1.b = 0;

    }
};

__exports.__wbg_values_a24d1c74f807b7bb = function(arg0) {
    return addHeapObject(getObject(arg0).values());
};

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory;
}

__exports.__wbg_next_725045e6dea16463 = function(arg0, exnptr) {
    try {
        return addHeapObject(getObject(arg0).next());
    } catch (e) {
        const view = getUint32Memory();
        view[exnptr / 4] = 1;
        view[exnptr / 4 + 1] = addHeapObject(e);

    }
};

__exports.__wbg_done_6b0103c3045fcdba = function(arg0) {
    return getObject(arg0).done;
};

__exports.__wbg_value_16786cf1f8001022 = function(arg0) {
    return addHeapObject(getObject(arg0).value);
};

__exports.__wbg_get_e5244e978dedcdd0 = function(arg0, arg1, exnptr) {
    try {
        return addHeapObject(Reflect.get(getObject(arg0), getObject(arg1)));
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
    * @param {any} arg1
    * @returns {}
    */
    constructor(arg0, arg1) {
        try {
            this.ptr = wasm.levelone_new(addBorrowedObject(arg0), addBorrowedObject(arg1));

        } finally {
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;

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
    * @returns {void}
    */
    reset() {
        return wasm.levelone_reset(this.ptr);
    }
    /**
    * @param {Uint16Array} arg0
    * @returns {void}
    */
    on_event(arg0) {
        const ptr0 = passArray16ToWasm(arg0);
        const len0 = WASM_VECTOR_LEN;
        try {
            return wasm.levelone_on_event(this.ptr, ptr0, len0);

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 2);

        }

    }
}
__exports.LevelOne = LevelOne;

__exports.__wbindgen_object_clone_ref = function(idx) {
    return addHeapObject(getObject(idx));
};

__exports.__wbindgen_object_drop_ref = function(i) { dropObject(i); };

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

__exports.__wbindgen_string_new = function(p, l) {
    return addHeapObject(getStringFromWasm(p, l));
};

__exports.__wbindgen_number_new = function(i) { return addHeapObject(i); };

__exports.__wbindgen_number_get = function(n, invalid) {
    let obj = getObject(n);
    if (typeof(obj) === 'number') return obj;
    getUint8Memory()[invalid] = 1;
    return 0;
};

let cachedTextEncoder = new TextEncoder('utf-8');

function passStringToWasm(arg) {

    const buf = cachedTextEncoder.encode(arg);
    const ptr = wasm.__wbindgen_malloc(buf.length);
    getUint8Memory().set(buf, ptr);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
}

__exports.__wbindgen_string_get = function(i, len_ptr) {
    let obj = getObject(i);
    if (typeof(obj) !== 'string') return 0;
    const ptr = passStringToWasm(obj);
    getUint32Memory()[len_ptr / 4] = WASM_VECTOR_LEN;
    return ptr;
};

__exports.__wbindgen_throw = function(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
};

function init(path_or_module) {
    let instantiation;
    const imports = { './battle_rust': __exports };
    if (path_or_module instanceof WebAssembly.Module) {
        instantiation = WebAssembly.instantiate(path_or_module, imports)
        .then(instance => {
        return { instance, module: path_or_module }
    });
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

});
};
self.wasm_bindgen = Object.assign(init, __exports);
})();
