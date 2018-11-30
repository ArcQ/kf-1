use specs::{ReadStorage,
            System, WriteStorage};
use super::types;
use wasm_bindgen::prelude::*;
use specs::prelude::*;

pub mod components;

use self::components::{Id, CharStateStore, Move, Speed};

pub struct WatchAll;

#[wasm_bindgen]
extern "C" {
    type cljs_wasm_adapter;
    
    #[wasm_bindgen(static_method_of = cljs_wasm_adapter)]
    fn update(name: i32);

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);


    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);
}
    
impl<'a> System<'a> for WatchAll {
    type SystemData = (ReadStorage<'a, Id>, 
                       ReadStorage<'a, types::Pt>,
                       ReadStorage<'a, CharStateStore>);

    fn run(&mut self, (name, pos, charStateStore): Self::SystemData) {
        // js_watcher.call3(name, pos, charStateStore);



        for name in name.join() {
            cljs_wasm_adapter::update(name.0);
        }
    }
}

pub struct UpdateChar;

impl<'a> System<'a> for UpdateChar {
    type SystemData = (ReadStorage<'a, Move>,
                       ReadStorage<'a, Speed>,
                       WriteStorage<'a, types::Pt>);

    fn run(&mut self, (move_obj, speed, mut pos): Self::SystemData) {
        use specs::Join;
        for (move_obj, speed, pos) in (&move_obj, &speed, &mut pos).join() {
            let pos_clone = pos.clone();
            let new_pos = move_obj.next(0.006, &pos_clone, speed.value());
            pos.x = new_pos.x;
            pos.y = new_pos.y;
            log_u32(pos.x as u32);
            log_u32(pos.y as u32);
        }
    }
}
