use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub type js_wasm_adapter;

    #[wasm_bindgen(static_method_of = js_wasm_adapter)]
    pub fn update(arr: Box<[f32]>);

    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)] 
    pub fn log_u32(a: u32);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    pub fn log_f32(a: f32);
}
