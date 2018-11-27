use specs::{ReadStorage,
            System, WriteStorage};
use super::types;
use wasm_bindgen::prelude::*;
use specs::prelude::*;

pub mod components;

use self::components::{Name, CharType, CharStateStore, DestPt};

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
    type SystemData = (ReadStorage<'a, Name>, 
                       ReadStorage<'a, CharType>,
                       ReadStorage<'a, types::Pt>,
                       ReadStorage<'a, CharStateStore>);

    fn run(&mut self, (name, charType, pos, charStateStore): Self::SystemData) {
        // js_watcher.call3(name, charType, pos, charStateStore);



        for name in name.join() {
            cljs_wasm_adapter::update(name.0);
        }
    }
}

pub struct UpdateChar;

impl<'a> System<'a> for UpdateChar {
    type SystemData = (ReadStorage<'a, Name>, 
                       ReadStorage<'a, CharType>,
                       ReadStorage<'a, DestPt>,
                       WriteStorage<'a, types::Pt>,
                       WriteStorage<'a, CharStateStore>);

    fn run(&mut self, (name, charType, destPt, mut pos, charStateStore): Self::SystemData) {
        use specs::Join;
        log("Hello");

        for (destPt, pos) in (&destPt, &mut pos).join() {
            log_u32(destPt.x as u32);
            log_u32(destPt.y as u32);
            log_u32(pos.y as u32);
        }
    }
    // fn run(&mut self, (name, charType,  mut pos, charStateStore): Self::SystemData) {
    //     use specs::Join;
    //     log("Hello");
    //
    //     for pos in pos.join() {
    //         log_u32(pos.y as u32);
    //     }
    // }
}
