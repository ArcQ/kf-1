extern crate wasm_bindgen;
extern crate js_sys;
extern crate specs;

mod director;
mod game_state;
mod types;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn level_one_init(watch_state: &js_sys::Function) {
    game_state::init();
    game_state::add_watch(watch_state);
}

#[wasm_bindgen]
pub fn level_one_get_update(dt: f32, data: TypedArray<f32>) -> bool {
    director::update_interface::tick(dt, input_def);
    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn internal() {
        assert_eq!(4, add(2, 2));
    }
}
