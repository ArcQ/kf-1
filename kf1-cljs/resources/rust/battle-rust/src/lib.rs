extern crate wasm_bindgen;
extern crate js_sys;
extern crate specs;

use specs::prelude::*;
use wasm_bindgen::prelude::*;

mod ecs;
mod types;

use types::{CoderKeyMapping};

use ecs::{UpdateChar, WatchAll};
use ecs::components::{Key, Speed, Move};
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
    events_key_dict: CoderKeyMapping
}

const KEY_GOBLIN:i32 = 0;
const KEY_ASSASIN:i32 = 1;
const KEY_TARGET_CIRCLE:i32 = 2;

#[wasm_bindgen]
impl LevelOne {
    #[wasm_bindgen(constructor)]
    pub fn new(renderKeys: &js_sys::Object, eventKeys: &js_sys::Object) -> LevelOne { 
        let mut events_key_dict: CoderKeyMapping = CoderKeyMapping::new(eventKeys);
        let mut render_state_key_dict: CoderKeyMapping = CoderKeyMapping::new(renderKeys);

        let mut world: World = World::new();
        let mut dispatcher: Dispatcher = DispatcherBuilder::new()
            // .with(MapInputs, "input", &[])
            // .with(MakeDecisions, "AiMakeDecisions", &[])
            .with(UpdateChar::default(), "update_char", &[])
            .with_thread_local(WatchAll::new(render_state_key_dict))
            .build();
        dispatcher.setup(&mut world.res);

        // world.register::<Key>();
        // world.register::<types::Pt>();
        // world.register::<Move>();
        // world.register::<Speed>();
        //
        world.add_resource(DeltaTime(0.05)); 

        world.create_entity()
            .with(Key::new(KEY_GOBLIN))
            .with(types::Pt { x: 100.0, y: 100.0 })
            .with(Move::new())
            .with(Speed::new(10.0))
            .build();
        let mut assasin = world.create_entity()
            .with(Key::new(KEY_ASSASIN))
            .with(types::Pt { x: 200.0, y: 200.0 })
            .with(Move::new())
            .with(Speed::new(10.0))
            .build();

        let mut click_circle = world.create_entity()
            .with(Key::new(KEY_TARGET_CIRCLE))
            .with(types::Pt { x: 0.0, y: 0.0 })
            .build();
        // dispatcher.dispatch(&mut world.res);
        world.maintain();
        
        LevelOne { 
            dispatcher: dispatcher, 
            world: world, 
            assasin: assasin, 
            click_circle: click_circle, 
            events_key_dict: events_key_dict,
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
        let event_str: &str = self.events_key_dict.decode(input_def[0]);
        match event_str {
            "click" => {
                {
                    log("click");
                    let char_height = 84;
                    let mut move_storage = self.world.write_storage::<Move>();
                    let mut pos_storage = self.world.read_storage::<types::Pt>();
                    if let (Some(assasin_move_comp), Some(assasin_pos_comp)) = (move_storage.get_mut(self.assasin), pos_storage.get(self.assasin)) {
                        assasin_move_comp.calc_new_dest(1.0, assasin_pos_comp, [input_def[1] as f32, (input_def[2] - (char_height / 2)) as f32]);
                    } 
                } 
                {
                    let mut mut_pos_storage = self.world.write_storage::<types::Pt>();
                    if let (Some(circle_pos_comp)) = (mut_pos_storage.get_mut(self.click_circle)) {
                        circle_pos_comp.x = input_def[1] as f32;
                        circle_pos_comp.y = input_def[2] as f32;
                    }
                }
            }
            _ => (),
        }
    }
}

#[wasm_bindgen]
pub fn level_one_dealloc() {
}
