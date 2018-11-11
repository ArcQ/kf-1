extern crate wasm_bindgen;
extern crate js_sys;
extern crate specs;

use specs::prelude::*;

mod ecs;
mod types;

use ecs::{UpdateChar, WatchAll};

use ecs::components::{Name, CharType, Speed};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct LevelOne {
    dispatcher: Dispatcher<'static, 'static>,
    world: World,
}

#[wasm_bindgen]
impl LevelOne {
    #[wasm_bindgen(constructor)]
    pub fn new(watch_state: &js_sys::Function) -> LevelOne {
        unsafe {
            let mut world: World = World::new();
            world.register::<Name>();
            world.register::<CharType>();
            world.register::<types::Pt>();
            world.register::<Speed>();

            // Only the second entity will get a position update,
            // because the first one does not have a velocity.
            world.create_entity()
                .with(Name::new(1))
                .with(CharType::new(0))
                .with(types::Pt { x: 100.0, y: 100.0 })
                .with(Speed::new(10.0))
                .build();
            world.create_entity()
                .with(Name::new(2))
                .with(CharType::new(1))
                .with(types::Pt { x: 200.0, y: 200.0 })
                .with(Speed::new(10.0))
                .build();

            let mut dispatcher: Dispatcher = DispatcherBuilder::new()
                // .with(MapInputs, "input", &[])
                // .with(MakeDecisions, "AiMakeDecisions", &[])
                .with(UpdateChar, "update_char", &[])
                // .with_thread_local(WatchAll)
                .build();
            dispatcher.setup(&mut world.res);
            dispatcher.dispatch(&mut world.res);
            world.maintain();
            LevelOne { dispatcher: dispatcher, world: world }
        }
    }

    pub fn level_one_get_update(&mut self, dt: f32, input_def: &[f32]) {
        self.dispatcher.dispatch(&mut self.world.res)
    }
}

#[wasm_bindgen]
pub fn level_one_dealloc(watch_state: &js_sys::Function) {
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn internal() {
        assert_eq!(4, add(2, 2));
    }
}
