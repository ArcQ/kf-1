use std::collections::HashMap;
use utils::js_event_emitter::JsEventEmitter;
use types::{GameMap};
use utils::char_dicts;

pub trait GameEnv {
    fn new(js_event_emitter: JsEventEmitter, game_map: GameMap, char_dict: HashMap<String, char_dicts::CharInitialConfig>) -> Self; 

    fn tick(&mut self, dt: f32); 

    fn reset(&mut self, game_map: GameMap, char_dict: HashMap<String, char_dicts::CharInitialConfig>); 
}
