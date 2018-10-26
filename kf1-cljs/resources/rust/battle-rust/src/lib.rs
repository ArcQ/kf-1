extern crate wasm_bindgen;
extern crate specs;

mod director;
mod game_state;
mod types;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn init(_config: Config, watchState: fn(types::GameState) -> !) {
    game_state::init();
    game_state::add_watch(watchState);
    let config = Config { useOwnState: false };
}

#[wasm_bindgen]
pub let getUpdate = director::update_interface::tick;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn internal() {
        assert_eq!(4, add(2, 2));
    }
}
