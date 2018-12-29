use specs::{ReadStorage,
System, WriteStorage, ReaderId, Entities};
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

pub struct SystemTracker {
    pub reader_id: Option<ReaderId<ComponentEvent>>,
    pub tracked_i: Vec<i32>,
    pub modified: Vec<BitSet>
}

impl SystemTracker {
    pub fn new<T>(tracked_i: Vec<i32>, system_data: T) -> SystemTracker {
        let tracked_i_len = tracked_i.len();
        SystemTracker {
            reader_id: Option::default(),
            tracked_i: tracked_i,
            modified: vec![BitSet::new(); tracked_i_len],
        }
    }
    pub fn track_storages() -> asdf {
        if let Some(r_id) = self.reader_id.as_mut() {
            let events = storage.channel(storage)
                .read(r_id);
            for event in events {
                match event {
                    ComponentEvent::Modified(id) => { self.modified.get_mut(0).unwrap().add(*id); },
                    _ => { },
                };
            }
        }
    }
}

pub struct WatchAll {
    pub reader_id: Option<ReaderId<ComponentEvent>>,
    pub modified: Vec<BitSet>,
    pub encoderkeys_dict: types::CoderKeyMapping,
    pub system_tracker: SystemTracker,
}

impl <'a> WatchAll {
    pub fn new(encoderkeys_dict: types::CoderKeyMapping) -> WatchAll {
        WatchAll {
            reader_id: Option::default(),
            modified: vec![],
            encoderkeys_dict: encoderkeys_dict,
            system_tracker: SystemTracker::new(vec![1,3], system_data: Self::SystemData),
        }
    }
}

impl<'a> System<'a> for WatchAll {
    type SystemData = (
        Entities<'a>,
        ReadStorage<'a, CharStateMachine>,
        ReadStorage<'a, Key>,
        ReadStorage<'a, types::Pt>);

    fn run(&mut self, system_data: Self::SystemData) {
        let (entities, char_state_storage, key_storage, pos_storage) = system_data;
        // TODO create a parent class that does this without doing it over and over
        if let Some(r_id) = self.reader_id.as_mut() {
            let events = pos_storage.channel()
                .read(r_id);
            for event in events {
                match event {
                    ComponentEvent::Modified(id) => { self.system_tracker.modified.get_mut(0).unwrap().add(*id); },
                    _ => { },
                };
            }
        }

        let mut state_vec = vec![];
        //TODO should come up with a method to do this automatically
        for (entity, key, pos, _t) in (&entities, &key_storage, &pos_storage, self.system_tracker.modified.get(0).unwrap()).join() {
            let mut sub_state_vec = vec![];
            log_f32(entity.id() as f32);
            log_f32(_t as f32);
            let key_set_spritepos = self.encoderkeys_dict.encode("KEY_SET_SPRITE_POS");
            let char_state: Option<& CharStateMachine> = char_state_storage.get(entity);
            let key_assasin = self.encoderkeys_dict.encode("KEY_ASSASIN");
            let key_target_circle = self.encoderkeys_dict.encode("KEY_TARGET_CIRCLE");
            // log_f32(key_set_spritepos as f32);

            sub_state_vec.push(key_set_spritepos as f32);
            sub_state_vec.push(key.0 as f32);

            if let Some(char_state) = char_state {
                let key_char_state = self.encoderkeys_dict.encode(&char_state.state.to_string());
                sub_state_vec.push(key_char_state as f32);
            }

            sub_state_vec.push(pos.x);
            sub_state_vec.push(pos.y);
            
            let sub_state_vec_len = sub_state_vec.len();
            if sub_state_vec.len() > 0 {
                sub_state_vec.insert(0 as usize, (sub_state_vec_len + 1) as f32);
                state_vec.append(&mut sub_state_vec);
            }
        }
        let state_vec_len = state_vec.len();
        if state_vec.len() > 0 {
            state_vec.insert(0 as usize, (state_vec_len + 1) as f32);
            let state_diff_ptr: Box<[f32]> = state_vec.into_boxed_slice();
            cljs_wasm_adapter::update(state_diff_ptr);
        }
        self.system_tracker.modified.get_mut(0).unwrap().clear();
    }

    fn setup(&mut self, res: &mut Resources) {
        Self::SystemData::setup(res);
        self.reader_id = Some(WriteStorage::<types::Pt>::fetch(&res).register_reader());
        self.modified.append(&mut vec![BitSet::new(), BitSet::new()]);
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
            let nextpos_def = move_obj.next(dt, &pos_clone, speed.value());
            pos.x = nextpos_def.pt.x;
            pos.y = nextpos_def.pt.y;
            if nextpos_def.completed {
                char_state.set_state(CharState::IDLE);
                clear.push(event);
            }
            char_state.set_state(CharState::MOVE);
        }

        for event in clear {
            log("finished");
            self.move_required.remove(event);
        }

        for pos in &mut pos.join() {
            // log_f32(pos.x as f32);
            // log_f32(pos.y as f32);
        }
    }
    fn setup(&mut self, res: &mut Resources) {
        Self::SystemData::setup(res);
        self.reader_id = Some(WriteStorage::<Move>::fetch(&res).register_reader());
        self.move_required = BitSet::new();
    }
}
