use specs::{ReadStorage,
System, WriteStorage, ReaderId};
use specs::storage::ComponentEvent;
use super::types;
use wasm_bindgen::prelude::*;
use specs::prelude::*;

pub mod components;
pub mod resources;

use self::components::{Key, Move, Speed, CharState, CharStateMachine};

#[wasm_bindgen]
extern "C" {
    type cljs_wasm_adapter;

    #[wasm_bindgen(static_method_of = cljs_wasm_adapter)]
    fn update(arr: Box<[f32]>);

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)] 
    fn log_u32(a: u32);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_f32(a: f32);
}

pub struct WatchAll {
    pub reader_id: Option<ReaderId<ComponentEvent>>,
    pub modified: BitSet,
    pub encoder_keys_dict: types::CoderKeyMapping,
}

impl WatchAll {
    pub fn new(encoder_keys_dict: types::CoderKeyMapping) -> WatchAll {
        WatchAll {
            reader_id: Option::default(),
            modified: BitSet::default(),
            encoder_keys_dict: encoder_keys_dict
        }
    }
}

impl<'a> System<'a> for WatchAll {
    type SystemData = (ReadStorage<'a, Key>,
                       ReadStorage<'a, CharStateMachine>,
                       ReadStorage<'a, types::Pt>);

    fn run(&mut self, (key, char_state, pos): Self::SystemData) {
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
        for (_key, _pos, char_state, _) in (&key, &pos, &char_state, &self.modified).join() {
            let key_set_sprite_pos = self.encoder_keys_dict.encode("KEY_SET_SPRITE_POS");
            // log_f32(key_set_sprite_pos as f32);
            let key_char_state = self.encoder_keys_dict.encode(&char_state.state.to_string());
            let key_assasin = self.encoder_keys_dict.encode("KEY_ASSASIN");
            let key_target_circle = self.encoder_keys_dict.encode("KEY_TARGET_CIRCLE");

            if _key.0 == key_assasin {
                state_vec.push(key_char_state as f32);
                state_vec.push(key_set_sprite_pos as f32);
                state_vec.push(key_assasin as f32);
                state_vec.push(_pos.x);
                state_vec.push(_pos.y);
            }
            if _key.0 == key_target_circle {
                state_vec.push(key_char_state as f32);
                state_vec.push(key_set_sprite_pos as f32);
                state_vec.push(key_assasin as f32);
                state_vec.push(key_target_circle as f32);
                state_vec.push(_pos.x);
                state_vec.push(_pos.y);
            };
        }
        let state_vec_len = state_vec.len();
        if state_vec.len() > 0 {
            state_vec.insert(0 as usize, state_vec_len as f32);
            let state_diff_ptr: Box<[f32]> = state_vec.into_boxed_slice();
            cljs_wasm_adapter::update(state_diff_ptr);
        }
        self.modified.clear();
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
                       WriteStorage<'a, CharStateMachine>,
                       WriteStorage<'a, types::Pt>);

    fn run(&mut self, (delta, move_obj, speed, mut char_state, mut pos): Self::SystemData) {
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

        for (move_obj, pos, speed, char_state, event) in (&move_obj, &mut pos, &speed, &mut char_state, &self.move_required).join() {
            let pos_clone = pos.clone();
            let next_pos_def = move_obj.next(dt, &pos_clone, speed.value());
            pos.x = next_pos_def.pt.x;
            pos.y = next_pos_def.pt.y;
            if next_pos_def.completed {
                char_state.set_state(CharState::IDLE);
                clear.push(event);
            }
            char_state.set_state(CharState::MOVE);
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
