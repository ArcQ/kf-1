use specs::{ReadStorage,
System, WriteStorage, ReaderId};
use specs::storage::ComponentEvent;
use super::types;
use wasm_bindgen::prelude::*;
use specs::prelude::*;

pub mod components;

use self::components::{Key, CharStateStore, Move, Speed};

pub struct WatchAll;

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

impl<'a> System<'a> for WatchAll {
    type SystemData = (
        ReadStorage<'a, Key>,
        ReadStorage<'a, types::Pt>,
        ReadStorage<'a, CharStateStore>);

    fn run(&mut self, (name, pos, char_state_store): Self::SystemData) {
        // js_watcher.call3(name, pos, char_state_store);

        for name in name.join() {
            // cljs_wasm_adapter::update(name.0);
        }
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
    type SystemData = (ReadStorage<'a, Move>,
                       ReadStorage<'a, Speed>,
                       WriteStorage<'a, types::Pt>);

    fn run(&mut self, (move_obj, speed, mut pos): Self::SystemData) {
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

        for (_move_obj, pos, _speed, event) in (&move_obj, &mut pos, &speed, &self.move_required).join() {
            let pos_clone = pos.clone();
            let next_pos_def = _move_obj.next(0.05, &pos_clone, _speed.value());
            pos.x = next_pos_def.pt.x;
            pos.y = next_pos_def.pt.y;
            if next_pos_def.completed {
                // self.move_required.clear();
                log("finished");
                clear.push(event);
                log_u32(*clear.get(0).unwrap());
            }

            log("x");
            log_f32(pos.x as f32);
            log("y");
            log_f32(pos.y as f32);
            let state_diff_ptr: Box<[f32]> = vec![2.0, pos.x as f32, pos.y as f32].into_boxed_slice();
            cljs_wasm_adapter::update(state_diff_ptr);
            // let memory_buffer = wasm_bindgen::memory().dyn_into::<js_sys::WebAssembly::Memory>().unwrap().buffer();
            // let vert_array = js_sys::Float32Array::new_with_byte_offset(&memory_buffer, vertices.as_ptr() as u32).as_ref();
            // cljs_wasm_adapter::update(vert_array);

        }

        for event in clear {
            log("finished");
            self.move_required.remove(event);
        }

        for (_move_obj, _speed, _pos) in (&move_obj, &speed, &mut pos).join() {
            // log_u32(pos.x as u32);
            // log_u32(pos.y as u32);
        }
    }
    fn setup(&mut self, res: &mut Resources) {
        Self::SystemData::setup(res);
        self.reader_id = Some(WriteStorage::<Move>::fetch(&res).register_reader());
        self.move_required = BitSet::new();
    }
}
