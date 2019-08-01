use types::{GameMap};
use utils::encoder::CoderKeyMapping;
use wasm_bindgen::prelude::*;
use super::main::Kf1GameEnv;
use utils::encoder::EncodedMessageBuilder;
use utils::game_env::GameEnv;
use utils::char_dicts;
use types::Pt;
use utils::js_event_emitter::JsEventEmitter;

#[wasm_bindgen]
pub struct GameEnvAdapter {
    game_env: Kf1GameEnv,
    encoder_keys_dict: CoderKeyMapping,
}

#[wasm_bindgen]
impl GameEnvAdapter {
    #[wasm_bindgen(constructor)]
    pub fn new(broadcast_unchanged: bool, encoder_keys: &js_sys::Array, init_config: &wasm_bindgen::JsValue) -> GameEnvAdapter {
        let encoder_keys_dict: CoderKeyMapping = CoderKeyMapping::new(encoder_keys);
        let encoder_keys_dict_clone: CoderKeyMapping = CoderKeyMapping::new(encoder_keys);
        let game_map = GameMap::from_init_config(&init_config);
        let js_event_emitter = JsEventEmitter {
            encoded_message_builder: EncodedMessageBuilder::new(encoder_keys_dict_clone),
            broadcast_unchanged: broadcast_unchanged,
        };
        GameEnvAdapter {
            game_env: Kf1GameEnv::new(
                         js_event_emitter,
                         game_map,
                         char_dicts::create_char_dict(&encoder_keys_dict, init_config)),
                         encoder_keys_dict,
        }
    }

    // pub fn level_one_get_update(&mut self, dt: f32) {
    pub fn tick(&mut self, dt: f32) {
        self.game_env.tick(dt);
    }

    pub fn reset(&mut self, init_config: &wasm_bindgen::JsValue) {
        let game_map = GameMap::from_init_config(&init_config);
        self.game_env.reset(
            game_map,
            char_dicts::create_char_dict(&self.encoder_keys_dict, init_config));
    }

    pub fn on_event(&mut self, input_def: &[u16]) {
        let event_str: &str = self.encoder_keys_dict.decode(input_def[0].clone());

        match event_str {
            "MOVE" => {
                let entity_k = self.encoder_keys_dict.decode(input_def[1].clone());
                let pos = Pt::new(input_def[2].clone() as f32, input_def[3].clone() as f32);
                self.game_env.char_move(entity_k, pos);
            }
            "SPOT_ATTACK" => {
                self.game_env.char_spot_attack();
            }
            "FINISH_SPOT_ATTACK" => {
                self.game_env.char_finish_spot_attack();
            }
            _ => (),
        }
    }
}
