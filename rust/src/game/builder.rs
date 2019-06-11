use std::collections::HashMap;
use specs::prelude::*;
use js_imports;

use types::{GameMap, CoderKeyMapping, Pt};
use ecs::components::{
    Key, 
    Speed, 
    CharState, 
    Move, 
    CharStateMachine, 
    Orientation };

pub fn build_entities(
    init_config: &wasm_bindgen::JsValue, 
    world: &mut World, 
    entity_keys: Vec<&str>, 
    encoder_keys_dict: &CoderKeyMapping) -> HashMap<String, Entity> {

    let game_map = GameMap::from_init_config(&init_config);

    let mut entities: HashMap<String, Entity> = HashMap::new();
    for entity_k in entity_keys.into_iter() {
        js_get_mult!(
            init_config,
            Ok(js_pos_x), str ["char", entity_k, "pos", "0"].join("."),
            Ok(js_pos_y), str ["char", entity_k, "pos", "1"].join("."),
            {
                let blah = Pt::new_from_js(&js_pos_x, &js_pos_y);
                js_imports::log_f32(blah.x);
                entities.insert(entity_k.to_string(), world.create_entity()
                                .with(Key(encoder_keys_dict.encode(entity_k)))
                                .with(Pt::new_from_js(&js_pos_x, &js_pos_y))
                                // game map only has one instance at one time, we should actually
                                // just use one and modify that instance if we ever have to change
                                .with(Move::new(game_map.clone()))
                                .with(Speed(10.0))
                                // .with(Health::new(100.0))
                                .with(Orientation(0.0))
                                .with(CharStateMachine(CharState::IDLE))
                                .build()); 
            })
    }
    entities
}
