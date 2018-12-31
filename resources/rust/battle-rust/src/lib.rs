extern crate wasm_bindgen;
extern crate js_sys;
extern crate strum;

#[macro_use]
extern crate strum_macros;
extern crate specs;

use specs::prelude::*;
use wasm_bindgen::prelude::*;

mod ecs;
mod types;

use types::{CoderKeyMapping};

use ecs::{UpdateChar, WatchAll};
use ecs::components::{Key, Speed, Move, CharState, CharStateMachine};
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

#[wasm_bindgen]
pub struct LevelOne {
    dispatcher: Dispatcher<'static, 'static>,
    world: World,
    assasin: Entity,
    click_circle: Entity,
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

        world.create_entity()
            .with(Key(encoder_keys_dict.encode("KEY_GOBLIN")))
            .with(types::Pt { x: 100.0, y: 100.0 })
            .with(Move::default())
            .with(Speed(10.0))
            .with(CharStateMachine(CharState::IDLE) )
            .build();
        let mut assasin = world.create_entity()
            .with(Key(encoder_keys_dict.encode("KEY_ASSASIN")))
            .with(types::Pt { x: 200.0, y: 200.0 })
            .with(Move::default())
            .with(Speed(10.0))
            .with(CharStateMachine(CharState::IDLE) )
            .build();

        let mut click_circle = world.create_entity()
            .with(Key(encoder_keys_dict.encode("KEY_TARGET_CIRCLE")))
            .with(types::Pt { x: 0.0, y: 0.0 })
            .build();
        // dispatcher.dispatch(&mut world.res);
        world.maintain();

        LevelOne { 
            dispatcher: dispatcher, 
            world: world, 
            assasin: assasin, 
            click_circle: click_circle, 
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
        match event_str {
            "MOVE" => {
                {
                    log("MOVE");
                    let char_height = 84;
                    let mut move_storage = self.world.write_storage::<Move>();
                    let mut char_state_storage = self.world.write_storage::<CharStateMachine>();
                    let pos_storage = self.world.read_storage::<types::Pt>();
                    if let (
                        Some(assasin_char_state_storage), 
                        Some(assasin_move_comp), 
                        Some(assasin_pos_comp)
                        ) = (
                            char_state_storage.get_mut(self.assasin), 
                            move_storage.get_mut(self.assasin), 
                            pos_storage.get(self.assasin)
                            ) {
                            assasin_char_state_storage.0 = CharState::MOVE;
                            assasin_move_comp.calc_new_dest(
                                1.0, 
                                assasin_pos_comp, 
                                [input_def[1] as f32, (input_def[2] - (char_height / 2)) as f32]);
                        } 
                } 
                {
                    let mut mut_pos_storage = self.world.write_storage::<types::Pt>();
                    if let Some(circle_pos_comp) = mut_pos_storage.get_mut(self.click_circle) {
                        circle_pos_comp.x = input_def[1] as f32;
                        circle_pos_comp.y = input_def[2] as f32;
                    }
                }
            }
            "SPOT_ATTACK" => {}
            _ => (),
        }
    }
}

#[wasm_bindgen]
pub fn level_one_dealloc() {
}
