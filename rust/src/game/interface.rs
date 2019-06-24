use types::{CoderKeyMapping, Pt};
use game::builder::build_entities;
use specs::prelude::*;
use wasm_bindgen::prelude::*;
use std::collections::HashMap;

use systems::{move_system, broadcast_updates_system};
use components::basic::{
    Key, 
   CharState, 
    Move, 
    CharStateMachine, 
    Orientation };
use resources::DeltaTime;
// this is too heavy to be a real interface, it's more like the js interface + the game env
// instance combined, just to move faster atm
#[wasm_bindgen]
pub struct GameEnvInterface {
    dispatcher: Dispatcher<'static, 'static>,
    world: World,
    entities: HashMap<String, Entity>,
    encoder_keys_dict: CoderKeyMapping,
}

#[wasm_bindgen]
impl GameEnvInterface {
    #[wasm_bindgen(constructor)]
    pub fn new(encoder_keys: &js_sys::Array, init_config: &wasm_bindgen::JsValue) -> GameEnvInterface { 
        let encoder_keys_dict: CoderKeyMapping = CoderKeyMapping::new(encoder_keys);
        let encoder_keys_dict_clone: CoderKeyMapping = CoderKeyMapping::new(encoder_keys);
        
        let mut world: World = World::new();
        world.register::<CharStateMachine>();
        world.register::<Orientation>();
        world.register::<Key>();

        let mut dispatcher: Dispatcher = DispatcherBuilder::new()
            // .with(MapInpute, "input", &[])
            // .with(MakeDecisions, "AiMakeDecisions", &[])
            .with(move_system::MoveSystem::default(), "update_char", &[])
            .with_thread_local(broadcast_updates_system::BroadcastUpdatesSystem::new(encoder_keys_dict_clone))
            .build();

        dispatcher.setup(&mut world.res);
        world.add_resource(DeltaTime(0.05)); 

        let entity_keys = vec!["P1", "P2"];

        let entities: HashMap<String, Entity> = build_entities(
            init_config, 
            &mut world, 
            entity_keys, 
            &encoder_keys_dict);

        // dispatcher.dispatch(&mut world.res);
        world.maintain();

        GameEnvInterface { 
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

    pub fn reset(&mut self, init_config: &wasm_bindgen::JsValue) {
        let entity_keys = vec!["P1", "P2"];
        
        let entities: HashMap<String, Entity> = build_entities(
            init_config, 
            &mut self.world, 
            entity_keys, 
            &self.encoder_keys_dict);

        self.entities = entities;
    }

    pub fn on_event(&mut self, input_def: &[u16]) {
        let event_str: &str = self.encoder_keys_dict.decode(input_def[0]);
        match event_str {
            "MOVE" => {
                {
                    let entity_key = self.encoder_keys_dict.decode(input_def[1]);
                    let mut move_storage = self.world.write_storage::<Move>();
                    let mut char_state_storage = self.world.write_storage::<CharStateMachine>();
                    let mut orientation_storage = self.world.write_storage::<Orientation>();
                    let pos_storage = self.world.read_storage::<Pt>();

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
