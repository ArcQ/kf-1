extern crate wasm_bindgen;
extern crate js_sys;
extern crate strum;

#[macro_use]
extern crate strum_macros;
extern crate specs;

use specs::prelude::*;
use wasm_bindgen::prelude::*;
use std::collections::HashMap;

mod ecs;
mod types;

use types::{CoderKeyMapping};

use ecs::{UpdateChar, WatchAll};
use ecs::components::{Health, Key, Speed, Move, CharState, CharStateMachine, Orientation};
use ecs::resources::{DeltaTime};

#[wasm_bindgen]
extern "C" {
    type cljs_wasm_adapter;

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_f32(a: f32);
}


pub fn blah<T: Component, F>(storage: Storage<'_, T, specs::shred::FetchMut<'_, specs::storage::MaskedStorage<T>>>, entity_opt: Option<&Entity>, cb: F) 
where F: Fn(&mut T) {
    let mut s = storage;
    if let Some(entity) = entity_opt {
        if let Some(entity_char_state_storage) = s.get_mut(*entity) { 
            cb(entity_char_state_storage);
        }
    }
}


#[wasm_bindgen]
pub struct LevelOne {
    dispatcher: Dispatcher<'static, 'static>,
    world: World,
    entities: HashMap<String, Entity>,
    encoder_keys_dict: CoderKeyMapping
}

#[wasm_bindgen]
impl LevelOne {
    #[wasm_bindgen(constructor)]
    pub fn new(encoderKeys: &js_sys::Array) -> LevelOne { 
        let encoder_keys_dict: CoderKeyMapping = CoderKeyMapping::new(encoderKeys);
        let encoder_keys_dict_clone: CoderKeyMapping = CoderKeyMapping::new(encoderKeys);

        let mut world: World = World::new();
        world.register::<CharStateMachine>();
        let mut dispatcher: Dispatcher = DispatcherBuilder::new()
            // .with(MapInputs, "input", &[])
            // .with(MakeDecisions, "AiMakeDecisions", &[])
            .with(UpdateChar::default(), "update_char", &[])
            .with_thread_local(WatchAll::new(encoder_keys_dict_clone))
            .build();
        dispatcher.setup(&mut world.res);

        world.add_resource(DeltaTime(0.05)); 

        let entity_keys = vec!["P1", "P2"];
        let mut entities: HashMap<String, Entity> = HashMap::new();

        for k in entity_keys.into_iter() {
            entities.insert(k.to_string(), world.create_entity()
                            .with(Key(encoder_keys_dict.encode(k)))
                            .with(types::Pt { x: 200.0, y: 200.0 })
                            .with(Move::default())
                            .with(Speed(10.0))
                            // .with(Health::new(100.0))
                            .with(Orientation(0.0))
                            .with(CharStateMachine(CharState::IDLE))
                            .build()); 
        }

        // dispatcher.dispatch(&mut world.res);
        world.maintain();

        LevelOne { 
            dispatcher: dispatcher, 
            world: world, 
            entities: entities, 
            encoder_keys_dict: encoder_keys_dict,
        }
    }

    // pub fn level_one_get_update(&mut self, dt: f32) {
    pub fn get_update(&mut self, dt: f32) {
        {
            let mut delta = self.world.write_resource::<DeltaTime>();
            *delta = DeltaTime(dt);
        }
        self.dispatcher.dispatch(&mut self.world.res);
    }

    // pub fn level_one_get_update(&mut self, dt: f32, input_def: &[f32]) {
    pub fn on_event(&mut self, input_def: &[u16]) {
        let event_str: &str = self.encoder_keys_dict.decode(input_def[0]);
        log_u32(input_def[0] as u32);
        match event_str {
            "MOVE" => {
                {
                    log("MOVE");
                    let char_height = 84;
                    // let mut move_storage = self.world.write_storage::<Move>();
                    let mut char_state_storage = self.world.write_storage::<CharStateMachine>();
                    // let mut orientation_storage = self.world.write_storage::<Orientation>();
                    // let pos_storage = self.world.read_storage::<types::Pt>();

                    blah(char_state_storage, self.entities.get("P1"), |entity_char_state_storage| {
                        entity_char_state_storage.0 = CharState::MOVE; 
                    });
                    // blah(orientation_storage);
                    // blah(move_storage);

                    // if let (
                    //     Some(entity_char_state_storage), 
                    //     Some(entity_x_orientation_comp), 
                    //     Some(entity_move_comp), 
                    //     Some(entity_pos_comp)
                    //     ) = (
                    //         char_state_storage.get_mut(self.entities.get("P1")), 
                    //         orientation_storage.get_mut(self.entities.get("P1")), 
                    //         move_storage.get_mut(self.entities.get("P1")), 
                    //         pos_storage.get(self.entities.get("P1"))
                    //         ) {
                    //         entity_char_state_storage.0 = CharState::MOVE;
                    //         entity_move_comp.calc_new_dest(
                    //             1.0, 
                    //             entity_pos_comp, 
                    //             [input_def[1] as f32, (input_def[2] - (char_height / 2)) as f32]);
                    //         entity_x_orientation_comp.0 = entity_move_comp.get_x_direction();
                    //     }
                } 
            }
            // "SPOT_ATTACK" => {
            //     log("SPOT_ATTACK");
            //     let mut char_state_storage = self.world.write_storage::<CharStateMachine>();
            //     if let Some(entity_char_state_storage) = char_state_storage.get_mut(self.entities.get("P1")) {
            //         entity_char_state_storage.0 = CharState::SPOT_ATTACK;
            //     } 
            // }
            // "FINISH_SPOT_ATTACK" => {
            //     let mut char_state_storage = self.world.write_storage::<CharStateMachine>();
            //     if let Some(entity_char_state_storage) = char_state_storage.get_mut(self.entities.get("P1")) {
            //         entity_char_state_storage.0 = CharState::IDLE;
            //     } 
            // }
            _ => (),
        }
    }
}

#[wasm_bindgen]
pub fn level_one_dealloc() {
}
