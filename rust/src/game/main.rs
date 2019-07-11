use types::{Pt, GameMap};
use game::factory::create_entities;
use specs::prelude::*;
use std::collections::HashMap;
use utils::char_dicts;
use utils::game_env::GameEnv;
use utils::js_event_emitter::JsEventEmitter;
use super::input::{char_move, char_spot_attack, char_finish_spot_attack};

use systems::{move_system, broadcast_updates_system};
use components::basic::{
    Key, 
    CharStateMachine, 
    Orientation };
use resources::DeltaTime;

pub struct Kf1GameEnv {
    dispatcher: Dispatcher<'static, 'static>,
    world: World,
    entities: HashMap<String, Entity>,
}

impl GameEnv for Kf1GameEnv {
    fn new(
        js_event_emitter: JsEventEmitter, 
        game_map: GameMap, 
        char_dict: HashMap<String, char_dicts::CharInitialConfig>
        ) -> Kf1GameEnv { 
        let mut world: World = World::new();
        world.register::<CharStateMachine>();
        world.register::<Orientation>();
        world.register::<Key>();

        let mut dispatcher: Dispatcher = DispatcherBuilder::new()
            // .with(MapInpute, "input", &[])
            // .with(MakeDecisions, "AiMakeDecisions", &[])
            .with(move_system::MoveSystem::default(), "update_char", &[])
            .with_thread_local(broadcast_updates_system::BroadcastUpdatesSystem::new(js_event_emitter))
            .build();

        dispatcher.setup(&mut world.res);
        world.add_resource(DeltaTime(0.05)); 

        let entities: HashMap<String, Entity> = create_entities(
            &mut world,
            game_map,
            char_dict);

        world.maintain();

        Kf1GameEnv { 
            dispatcher: dispatcher, 
            world: world, 
            entities: entities, 
        }
    }

    fn tick(&mut self, dt: f32) {
        {
            let mut delta = self.world.write_resource::<DeltaTime>();
            *delta = DeltaTime(dt);
        }
        self.dispatcher.dispatch(&mut self.world.res);
    }

    fn reset(&mut self, game_map: GameMap, char_dict: HashMap<String, char_dicts::CharInitialConfig>) {
        let entities: HashMap<String, Entity> = create_entities(
            &mut self.world,
            game_map,
            char_dict);

        self.entities = entities;
    }
}

impl Kf1GameEnv {
    pub fn char_move(&mut self, entity_k: &str, pos: Pt) {
        char_move(&self.world, &self.entities, entity_k, pos);
    }
    pub fn char_spot_attack(&mut self) {
        char_spot_attack(&self.world, &self.entities);
    }
    pub fn char_finish_spot_attack(&mut self) {
        char_finish_spot_attack(&self.world, &self.entities);
    }
}
