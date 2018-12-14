use specs::{ReadStorage,
System, WriteStorage, ReaderId};
use specs::storage::ComponentEvent;
use super::types;
use wasm_bindgen::prelude::*;
use specs::prelude::*;

pub mod components;
pub mod resources;

use self::components::{Key, Move, Speed};

const KEY_GOBLIN:i32 = 0;
const KEY_ASSASIN:i32 = 1;
const KEY_TARGET_CIRCLE:i32 = 2;

#[wasm_bindgen]
extern "C" {
    type cljs_wasm_adapter;

    #[wasm_bindgen(static_method_of = cljs_wasm_adapter)]
    fn update(arr: Box<[f32]>);

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);


    #[wasm_bindgen(js_namespace = console, js_name = log)] fn log_u32(a: u32);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_f32(a: f32);
}

#[derive(Default)]
pub struct WatchAll {
    pub reader_id: Option<ReaderId<ComponentEvent>>,
    pub modified: BitSet,
}

impl<'a> System<'a> for WatchAll {
    type SystemData = (ReadStorage<'a, Key>,
                       ReadStorage<'a, types::Pt>);

    fn run(&mut self, (key, pos): Self::SystemData) {
        // TODO create a parent class that does this without doing it over and over
        if let Some(r_id) = self.reader_id.as_mut() {
            let events = pos.channel()
                .read(r_id);
            for event in events {
                match event {
                    ComponentEvent::Modified(id) => { self.modified.add(*id); },
                    _ => { },
                };
            }
        }

        let mut state_vec = Vec::new();
        //TODO should come up with a method to do this automatically
        for (_key, _pos, _) in (&key, &pos, &self.modified).join() {
            if _key.0 == KEY_ASSASIN {
                state_vec.push(3.0);
                state_vec.push(KEY_ASSASIN as f32);
                state_vec.push(_pos.x);
                state_vec.push(_pos.y);
            }
            if _key.0 == KEY_TARGET_CIRCLE {
                log("TARGET");
                log_f32(KEY_TARGET_CIRCLE as f32);
                state_vec.push(3.0);
                state_vec.push(KEY_TARGET_CIRCLE as f32);
                state_vec.push(_pos.x);
                state_vec.push(_pos.y);
            };
        }
        let state_vec_len = state_vec.len();
        state_vec.insert(0 as usize, state_vec_len as f32);
        self.modified.clear();
        if state_vec.len() > 0 {
            let state_diff_ptr: Box<[f32]> = state_vec.into_boxed_slice();
            cljs_wasm_adapter::update(state_diff_ptr);
        }
    }

    fn setup(&mut self, res: &mut Resources) {
        Self::SystemData::setup(res);
        self.reader_id = Some(WriteStorage::<types::Pt>::fetch(&res).register_reader());
        self.modified = BitSet::new();
    }
}

#[derive(Default)]
pub struct UpdateChar {
    // These keep track of where you left off in the event channel.
    pub reader_id: Option<ReaderId<ComponentEvent>>,

    // The bitsets where destination got modified and requires a move.next()
    pub move_required: BitSet,
}

impl<'a> System<'a> for UpdateChar {
    type SystemData = (Read<'a, resources::DeltaTime>,
                       ReadStorage<'a, Move>,
                       ReadStorage<'a, Speed>,
                       WriteStorage<'a, types::Pt>);

    fn run(&mut self, (delta, move_obj, speed, mut pos): Self::SystemData) {
        if let Some(r_id) = self.reader_id.as_mut() {
            let events = move_obj.channel()
                .read(r_id);
            for event in events {
                match event {
                    ComponentEvent::Modified(id) => { self.move_required.add(*id); },
                    _ => { },
                };
            }
        }

        let mut clear: Vec<u32> = Vec::new();
        let dt = delta.0;

        for (_move_obj, pos, _speed, event) in (&move_obj, &mut pos, &speed, &self.move_required).join() {
            let pos_clone = pos.clone();
            let next_pos_def = _move_obj.next(dt, &pos_clone, _speed.value());
            pos.x = next_pos_def.pt.x;
            pos.y = next_pos_def.pt.y;
            if next_pos_def.completed {
                log("finished");
                clear.push(event);
            }
        }

        for event in clear {
            log("finished");
            self.move_required.remove(event);
        }

        for _pos in &mut pos.join() {
            // log_f32(_pos.x as f32);
            // log_f32(_pos.y as f32);
        }
    }
    fn setup(&mut self, res: &mut Resources) {
        Self::SystemData::setup(res);
        self.reader_id = Some(WriteStorage::<Move>::fetch(&res).register_reader());
        self.move_required = BitSet::new();
    }
}
