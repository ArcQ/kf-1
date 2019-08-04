use specs::prelude::*;
use types::{Pt};
use std::collections::HashMap;
use components::basic::{
    CharState, 
    Move, 
    CharStateMachine, 
    Orientation };

pub fn char_move(world: &World, entities: &HashMap<String, Entity>, entity_key: &str, pos: Pt) {

    let mut move_storage = world.write_storage::<Move>();
    let mut char_state_storage = world.write_storage::<CharStateMachine>();
    let mut orientation_storage = world.write_storage::<Orientation>();
    let pos_storage = world.read_storage::<Pt>();

    unpack_storage!(
        entities.get(entity_key), 
        [Some(entity_char_state_storage) = mut char_state_storage], 
        [Some(entity_x_orientation_comp) = mut orientation_storage], 
        [Some(entity_move_comp) = mut move_storage], 
        [Some(entity_pos_comp) = pos_storage], 
        {
            entity_char_state_storage.0 = CharState::MOVE;
            entity_move_comp.calc_new_dest(
                1.0, 
                entity_pos_comp, 
                pos);
            entity_x_orientation_comp.0 = entity_move_comp.get_x_direction();
        });
}

pub fn char_spot_attack(world: &World, entities: &HashMap<String, Entity>) {
    let mut char_state_storage = world.write_storage::<CharStateMachine>();
    unpack_storage!(
        entities.get("P1"), 
        [Some(entity_char_state_storage) = mut char_state_storage], 
        {
            entity_char_state_storage.0 = CharState::SPOT_ATTACK;
        });
}

pub fn char_stop(world: &World, entities: &HashMap<String, Entity>) {
    let mut move_storage = world.write_storage::<Move>();
    unpack_storage!(
        entities.get("P1"), 
        [Some(entity_move_comp) = mut move_storage], 
        {
            entity_move_comp.stop();
        });
}

pub fn char_finish_spot_attack(world: &World, entities: &HashMap<String, Entity>) {
    let mut char_state_storage = world.write_storage::<CharStateMachine>();
    unpack_storage!(
        entities.get("P1"), 
        [Some(entity_char_state_storage) = mut char_state_storage], 
        {
            entity_char_state_storage.0 = CharState::IDLE;
        });
}
