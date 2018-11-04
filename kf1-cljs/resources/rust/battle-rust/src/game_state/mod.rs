use specs::{Builder, Component, DispatcherBuilder, ReadStorage,
            System, VecStorage, World, WriteStorage};
use wasm_bindgen::prelude::*;

pub fn add_watch(watch_state: &js_sys::Function) {
    let this = JsValue::NULL;
    let state = types::GameState {};
    watch_state.call1(&this, &state);
}

// enum CharStates {
//     Idle,
//     Move,
//     Attack,
// }
//
// #[derive(Debug)]
// struct Pos(types::Pt) ;
//
// impl Component for Pos {
//     type Storage = VecStorage<Self>;
// }
//
// #[derive(Debug)]
// struct CharState(String); 
//
// impl Component for CharState {
//     type Storage = VecStorage<Self>;
// }
//
// struct WatchAll;
//
// impl<'a> System<'a> for WatchAll {
//     type SystemData = ();
//
//     fn run(&mut self, (pos, charState): Self::SystemData) {
//         use specs::Join;
//
//         for pos in pos.join() {
//             println!("Hello, {:?}", &pos);
//         }
//     }
// }
//
// struct UpdateChar;
//
// impl<'a> System<'a> for UpdateChar {
//     type SystemData = (ReadStorage<'a, Pos>, 
//                        ReadStorage<'a, CharState>);
//
//     fn run(&mut self, (pos, charState): Self::SystemData) {
//         use specs::Join;
//
//         for pos in pos.join() {
//             println!("Hello, {:?}", &pos);
//         }
//     }
// }
//
// fn main() {
//     let mut world = World::new();
//
//     // Only the second entity will get a position update,
//     // because the first one does not have a velocity.
//     world.create_entity().with(Pos [4.0, 7.0]).build();
//     world
//         .create_entity()
//         .with(Pos [2.0, 5.0])
//         .build();
//
//     let mut dispatcher = DispatcherBuilder::new()
//         .with(UpdateChar, "update_char", &[])
//         .build();
//     
//     dispatcher.setup(&mut world.res);
//
//     dispatcher.dispatch(&mut world.res);
//     world.maintain();
// }
