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

use ecs::{MoveSystem, WatchAll};
use ecs::components::{
    // Health, 
    Key, Speed, Move, CharState, CharStateMachine, Orientation};
use ecs::resources::{DeltaTime};

#[wasm_bindgen]
extern "C" {
    type js_wasm_adapter;

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_f32(a: f32);
}

#[allow(unused_macros)]
macro_rules! iflet {
    ([$p:pat = $e:expr], $($rest:tt),*) => {
        if let $p = $e {
            iflet!($($rest),*);
        }
    };
    ($b:block) => {
        $b
    };
}

macro_rules! unpack_storage {
    ($entity_option:expr, [$some_p:pat = mut $storage_option_from_hash:expr], $($rest:tt),*) => {
        if let Some(entity) = $entity_option {
            if let $some_p = $storage_option_from_hash.get_mut(*entity) {
                unpack_storage!($entity_option, $($rest),*);
            }
        }
    };
    ($entity_option:expr, [$some_p:pat = $storage_option_from_hash:expr], $($rest:tt),*) => {
        if let Some(entity) = $entity_option {
            if let $some_p = $storage_option_from_hash.get(*entity) {
                unpack_storage!($entity_option, $($rest),*);
            }
        }
    };
    ($entity:expr, $b:block) => {
        $b
    };
}

macro_rules! js_get {
    ($js_value:expr, $ok:pat, str $k:expr, $b:block) => {
        if let $ok = js_sys::Reflect::get($js_value, &wasm_bindgen::JsValue::from($k)) {
            $b
        }
    };
    ($init_config:expr, $ok:pat, f64 $k:expr, $b:block,*) => {
        if let $ok = js_sys::Reflect::get(init_config, &wasm_bindgen::JsValue::from($k)) {
            $b
        }
    };
}

macro_rules! js_get_in {
    ($v:expr, $alias:pat, str $k:expr, $b:block) => {
        js_get!($v, $alias, str $k, {
            $b
        });
    };
    ($v:expr, $alias:pat, str $k:expr, $($rest:tt),*) => {
        js_get!($v, Ok(inner_v), str $k, {
            js_get_in!(inner_v, $alias, str $k, $($rest),*);
        });
    };
}

struct InitialCharState {
    pub pos: types::Pt
}

#[wasm_bindgen]
pub struct LevelOne {
    dispatcher: Dispatcher<'static, 'static>,
    world: World,
    entities: HashMap<String, Entity>,
    encoder_keys_dict: CoderKeyMapping,
    initial_char_states: HashMap<String, InitialCharState>
}

#[wasm_bindgen]
impl LevelOne {
    #[wasm_bindgen(constructor)]
    pub fn new(encoder_keys: &js_sys::Array, init_config: &wasm_bindgen::JsValue) -> LevelOne { 
        let encoder_keys_dict: CoderKeyMapping = CoderKeyMapping::new(encoder_keys);
        let encoder_keys_dict_clone: CoderKeyMapping = CoderKeyMapping::new(encoder_keys);

        let mut game_map = types::GameMap::default();
        let mut tile_scale = 60.0;
        let mut initial_state:&wasm_bindgen::JsValue;
        js_get_in!(init_config, Ok(js_tile_scale), str "tileScale",
                   {
                       if let Some(scale) = js_tile_scale.as_f64() {
                           tile_scale = scale;
                       }
                   });

        js_get_in!(init_config, Ok(js_game_map), str "gameMap",
                   { 
                       game_map = types::GameMap::from_js_array(&js_game_map, tile_scale as f32);
                   });

        // js_get_in!(init_config, Ok(js_initial_state), str "initialState",
        //            {
        //                initial_state = js_initial_state
        //            });

        let mut world: World = World::new();
        world.register::<CharStateMachine>();

        world.register::<Orientation>();
        world.register::<Key>();

        let mut dispatcher: Dispatcher = DispatcherBuilder::new()
            // .with(MapInpute, "input", &[])
            // .with(MakeDecisions, "AiMakeDecisions", &[])
            .with(MoveSystem::default(), "update_char", &[])
            .with_thread_local(WatchAll::new(encoder_keys_dict_clone))
            .build();

        dispatcher.setup(&mut world.res);

        world.add_resource(DeltaTime(0.05)); 
        
        let mut initial_char_states: HashMap<String, InitialCharState> = HashMap::new();

        initial_char_states.insert(String::from("P2"), InitialCharState { 
            pos: types::Pt {
                x: 100.0,
                y: 100.0,
            }, 
        });
        
        initial_char_states.insert(String::from("P1"), InitialCharState { 
            pos: types::Pt {
                x: 200.0,
                y: 200.0,
            }, 
        });

        let entity_keys = vec!["P1", "P2"];
        let mut entities: HashMap<String, Entity> = HashMap::new();

        for k in entity_keys.into_iter() {
            if let Some(initial_char_state) = initial_char_states.get(k) {
                entities.insert(k.to_string(), world.create_entity()
                                .with(Key(encoder_keys_dict.encode(k)))
                                .with(initial_char_state.pos.clone())
                                .with(Move::new(game_map.clone()))
                                .with(Speed(10.0))
                                // .with(Health::new(100.0))
                                .with(Orientation(0.0))
                                .with(CharStateMachine(CharState::IDLE))
                                .build()); 
            }
        }

        // dispatcher.dispatch(&mut world.res);
        world.maintain();

        LevelOne { 
            dispatcher: dispatcher, 
            world: world, 
            entities: entities, 
            encoder_keys_dict: encoder_keys_dict,
            initial_char_states: initial_char_states,
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

    pub fn reset(&mut self) {
        let mut move_storage = self.world.write_storage::<Move>();
        let mut pos_storage = self.world.write_storage::<types::Pt>();

        let entity_keys = vec!["P1", "P2"];
        for k in entity_keys.into_iter() {
            unpack_storage!(
                self.entities.get(k), 
                [Some(entity_move_comp) = mut move_storage], 
                [Some(entity_pos_comp) = mut pos_storage],
                {
                    if let Some(initial_char_state) = self.initial_char_states.get(k) {
                        entity_move_comp.stop();
                        entity_pos_comp.x = initial_char_state.pos.x;
                        entity_pos_comp.y = initial_char_state.pos.y;
                    };
                });
        }

    }

    pub fn on_event(&mut self, input_def: &[u16]) {
        // log_u32(input_def[0] as u32);
        let event_str: &str = self.encoder_keys_dict.decode(input_def[0]);
        match event_str {
            "MOVE" => {
                {
                    let entity_key = self.encoder_keys_dict.decode(input_def[1]);
                    // log("MOVE");
                    let mut move_storage = self.world.write_storage::<Move>();
                    let mut char_state_storage = self.world.write_storage::<CharStateMachine>();
                    let mut orientation_storage = self.world.write_storage::<Orientation>();
                    let pos_storage = self.world.read_storage::<types::Pt>();

                    unpack_storage!(
                        self.entities.get(entity_key), 
                        [Some(entity_char_state_storage) = mut char_state_storage], 
                        [Some(entity_x_orientation_comp) = mut orientation_storage], 
                        [Some(entity_move_comp) = mut move_storage], 
                        [Some(entity_pos_comp) = pos_storage], 
                        {
                            entity_char_state_storage.0 = CharState::MOVE;
                            entity_move_comp.calc_new_dest(
                                1.0, 
                                entity_pos_comp, 
                                [input_def[2] as f32, input_def[3] as f32]);
                            entity_x_orientation_comp.0 = entity_move_comp.get_x_direction();
                        });
                } 
            }
            "SPOT_ATTACK" => {
                let mut char_state_storage = self.world.write_storage::<CharStateMachine>();
                unpack_storage!(
                    self.entities.get("P1"), 
                    [Some(entity_char_state_storage) = mut char_state_storage], 
                    {
                        entity_char_state_storage.0 = CharState::SPOT_ATTACK;
                    });
            }
            "FINISH_SPOT_ATTACK" => {
                let mut char_state_storage = self.world.write_storage::<CharStateMachine>();
                unpack_storage!(
                    self.entities.get("P1"), 
                    [Some(entity_char_state_storage) = mut char_state_storage], 
                    {
                        entity_char_state_storage.0 = CharState::IDLE;
                    });
            }
            _ => (),
        }
    }
}

#[wasm_bindgen]
pub fn level_one_dealloc() {}
