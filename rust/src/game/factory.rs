use std::collections::HashMap;
use specs::prelude::*;
use utils::char_dicts;

use types::{GameMap};
use components::basic::{
    Key, 
    Speed, 
    CharState, 
    Move, 
    CharStateMachine, 
    Orientation };

pub fn create_entities(
    world: &mut World, 
    game_map: GameMap,
    char_dict: HashMap<String, char_dicts::CharInitialConfig>) -> HashMap<String, Entity> {

    let mut entities: HashMap<String, Entity> = HashMap::new();

    for (entity_k, char_initial_config) in char_dict.iter() {

        entities.insert(entity_k.to_string(), world.create_entity()
                        .with(Key(char_initial_config.encodedK))
                        .with(char_initial_config.pos.clone())
                        .with(Move::new(game_map.clone()))
                        .with(Speed(char_initial_config.speed))
                        // .with(Health::new(100.0))
                        .with(Orientation(0.0))
                        .with(CharStateMachine(CharState::IDLE))
                        .build()); 
    }
    entities
}
