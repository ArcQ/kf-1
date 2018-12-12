extern crate wasm_bindgen;
extern crate js_sys;
extern crate specs;

use specs::prelude::*;
use wasm_bindgen::prelude::*;

mod ecs;
mod types;

use ecs::{UpdateChar, WatchAll};
use ecs::components::{Key, Speed, Move};

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

struct EventsKeyDef {
    pub name: String,
    pub k: u16,
}

#[wasm_bindgen]
pub struct LevelOne {
    dispatcher: Dispatcher<'static, 'static>,
    world: World,
    assasin: Entity,
    // eventsKeyDict: Box<[EventsKeyDef]>,
    // eventsKeyDict: [EventsKeyDef; 1],
    events_key_dict: Vec<EventsKeyDef>,
}

const KEY_GOBLIN:i32 = 0;
const KEY_ASSASIN:i32 = 1;
const KEY_TARGET_CIRCLE:i32 = 1;

#[wasm_bindgen]
impl LevelOne {
    #[wasm_bindgen(constructor)]
    pub fn new(set: &js_sys::Object) -> LevelOne { 
        let mut events_key_dict: Vec<EventsKeyDef> = Vec::new();
        js_sys::Object::entries(set).map(&mut |kv: JsValue, i: u32, arr: js_sys::Array| -> JsValue {
            // let arr = js_sys::Array::from(&kv);
            // k.clone().unwrap().as_string().unwrap();
            let k_result: Result<JsValue, JsValue> = js_sys::Reflect::get(&kv, &JsValue::from(0));
            let v_result: Result<JsValue, JsValue> = js_sys::Reflect::get(&kv, &JsValue::from(1));
            let event_key_def = EventsKeyDef {
                name: k_result.clone().unwrap().as_string().unwrap(),
                k: v_result.clone().unwrap().as_f64().unwrap() as u16,
            };
            events_key_dict.push(event_key_def);
            JsValue::from(0)
        });

        let mut world: World = World::new();

        let mut dispatcher: Dispatcher = DispatcherBuilder::new()
            // .with(MapInputs, "input", &[])
            // .with(MakeDecisions, "AiMakeDecisions", &[])
            .with(UpdateChar::default(), "update_char", &[])
            .with_thread_local(WatchAll)
            .build();
        dispatcher.setup(&mut world.res);

        // world.register::<Key>();
        // world.register::<types::Pt>();
        // world.register::<Move>();
        // world.register::<Speed>();

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
            events_key_dict: events_key_dict,
        }
    }

    // pub fn level_one_get_update(&mut self, dt: f32) {
    pub fn get_update(&mut self, dt: f32) {
        self.dispatcher.dispatch(&mut self.world.res);
    }

    // pub fn level_one_get_update(&mut self, dt: f32, input_def: &[f32]) {
    pub fn on_event(&mut self, input_def: &[u16]) {
        let mut move_storage = self.world.write_storage::<Move>();
        let mut pos_storage = self.world.read_storage::<types::Pt>();
        let event_str: &str = &self.events_key_dict
            .iter()
            .find(|&event_key_def| event_key_def.k == input_def[0])
            .unwrap()
            .name;
        match event_str {
            "click" => if let (Some(move_comp), Some(pos_comp)) = (move_storage.get_mut(self.assasin), pos_storage.get(self.assasin)) {
                move_comp.calc_new_dest(1.0, pos_comp, [input_def[1] as f32, input_def[2] as f32]);
                // log_f32(input_def[0] as f32);
                // log_f32(input_def[1] as f32);
                // log_f32(input_def[2] as f32);
            }
            _ => (),
        }
    }
}

#[wasm_bindgen]
pub fn level_one_dealloc() {
}
