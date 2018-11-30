extern crate wasm_bindgen;
extern crate js_sys;
extern crate specs;

use specs::prelude::*;

mod ecs;
mod types;

use ecs::{UpdateChar, WatchAll};

use ecs::components::{Id, Speed, DestPt, Move};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_f32(a: f32);
}

#[wasm_bindgen]
pub struct LevelOne {
    dispatcher: Dispatcher<'static, 'static>,
    world: World,
    assasin: Entity,
}

const ID_GOBLIN:i32 = 0;
const ID_ASSASIN:i32 = 1;
const ID_TARGET_CIRCLE:i32 = 1;

#[wasm_bindgen]
impl LevelOne {
    #[wasm_bindgen(constructor)]
    pub fn new() -> LevelOne {
        let mut world: World = World::new();
        world.register::<Id>();
        world.register::<types::Pt>();
        // world.register::<DestPt>();
        world.register::<Move>();
        world.register::<Speed>();

        world.create_entity()
            .with(Id::new(ID_GOBLIN))
            .with(types::Pt { x: 100.0, y: 100.0 })
            // .with(DestPt { x: 0.0, y: 0.0 })
            .with(Speed::new(10.0))
            .build();
        let mut assasin = world.create_entity()
            .with(Id::new(ID_ASSASIN))
            .with(types::Pt { x: 200.0, y: 200.0 })
            .with(Move::new())
            .with(Speed::new(10.0))
            .build();

        let mut clickCircle = world.create_entity()
            .with(Id::new(ID_TARGET_CIRCLE))
            .with(types::Pt { x: 0.0, y: 0.0 })
            .build();

        let mut dispatcher: Dispatcher = DispatcherBuilder::new()
            // .with(MapInputs, "input", &[])
            // .with(MakeDecisions, "AiMakeDecisions", &[])
            .with(UpdateChar, "update_char", &[])
            .with_thread_local(WatchAll)
            .build();
        dispatcher.setup(&mut world.res);
        // dispatcher.dispatch(&mut world.res);
        world.maintain();
        LevelOne { dispatcher: dispatcher, world: world, assasin: assasin }
    }

    // pub fn level_one_get_update(&mut self, dt: f32) {
    pub fn get_update(&mut self, dt: f32) {
        self.dispatcher.dispatch(&mut self.world.res);
    }

    // pub fn level_one_get_update(&mut self, dt: f32, input_def: &[f32]) {
    pub fn on_event(&mut self, input_def: &[u16]) {
        let mut move_storage = self.world.write_storage::<Move>();
        let mut pos_storage = self.world.read_storage::<types::Pt>();
        // dest_pt_storage.insert(self.assasin, DestPt { x: 300.0, y: 400.0 });
        if let (Some(move_comp), Some(pos_comp)) = (move_storage.get_mut(self.assasin), pos_storage.get(self.assasin)) {
            move_comp.calc_new_dest(1.0, pos_comp, [input_def[0] as f32, input_def[1] as f32]);
            log_f32(input_def[0] as f32);
            log_f32(input_def[1] as f32);
        }
    }
}

#[wasm_bindgen]
pub fn level_one_dealloc() {
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn internal() {
        assert_eq!(4, add(2, 2));
    }
}
