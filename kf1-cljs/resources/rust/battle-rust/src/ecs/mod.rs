use specs::{ReadStorage,
            System, WriteStorage};
use super::types;
use wasm_bindgen::prelude::*;
use specs::prelude::*;

pub mod components;

use self::components::{Name, CharType, CharStateStore};

pub struct WatchAll;

#[wasm_bindgen]
extern "C" {
//     #[wasm_bindgen(js_namespace = game_config)]
//     fn level_one_update(name: i32);

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
            // level_one_update(name.0);
            log_u32(name.0 as u32);
        }
    }
}

pub struct UpdateChar;

impl<'a> System<'a> for UpdateChar {
    type SystemData = (ReadStorage<'a, Name>, 
                       ReadStorage<'a, CharType>,
                       WriteStorage<'a, types::Pt>,
                       WriteStorage<'a, CharStateStore>);

    fn run(&mut self, (name, charType, pos, charStateStore): Self::SystemData) {
        use specs::Join;

        for pos in pos.join() {
            println!("Hello, {:?}", &pos.y);
        }
    }
}
