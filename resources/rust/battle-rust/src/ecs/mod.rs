use std::collections::HashMap;
use specs::{ReadStorage,
System, WriteStorage, ReaderId, Entities, Component, Tracked};
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

pub struct KeyReaderIdMapping <'a>{
    pub k: &'a str,
    pub reader_id: Option<ReaderId<ComponentEvent>>,
}

#[derive(Default)]
pub struct ModifiedTrackerStore {
    reader_id: HashMap<String, Option<ReaderId<ComponentEvent>>>,
    modified: HashMap<String, BitSet>
}
// TODO let's not unwrap so hastily without proper throwing or default
impl ModifiedTrackerStore {
    pub fn init(&mut self, mapping_vec: Vec<KeyReaderIdMapping>) {
        for mapping in mapping_vec {
            self.reader_id.insert(mapping.k.to_string(), mapping.reader_id);
            self.modified.insert(mapping.k.to_string(), BitSet::new());
        }
    }
    pub fn get(&self, k: &str) -> &BitSet {
        self.modified.get(k).unwrap()
    }
    pub fn clear(&mut self, k: &str) {
        self.modified.get_mut(k).unwrap().clear();
    }
    pub fn get_mut(&mut self, k: &str) -> &mut BitSet {
        self.modified.get_mut(k).unwrap()
    }
    pub fn track<T>(&mut self, k: &str, storage: &ReadStorage<T>) 
        where T: Component,
              T::Storage : Tracked {
                  if let Some(r_id) = self.reader_id.get_mut(k).unwrap().as_mut() {
                      let events = storage.channel()
                          .read(r_id);
                      for event in events {
                          match event {
                              ComponentEvent::Modified(id) => { self.modified.get_mut(k).unwrap().add(*id); },
                              _ => { },
                          };
                      }
                  }
              }
    pub fn track_mut<T>(&mut self, k: &str, storage: &mut WriteStorage<T>) 
        where T: Component,
              T::Storage : Tracked {
                  if let Some(r_id) = self.reader_id.get_mut(k).unwrap().as_mut() {
                      let events = storage.channel()
                          .read(r_id);
                      for event in events {
                          match event {
                              ComponentEvent::Modified(id) => { self.modified.get_mut(k).unwrap().add(*id); },
                              _ => { },
                          };
                      }
                  }
              }
}

pub struct WatchAll {
    pub encoderkeys_dict: types::CoderKeyMapping,
    pub tracker_store: ModifiedTrackerStore,
}

impl <'a> WatchAll {
    pub fn new(encoderkeys_dict: types::CoderKeyMapping) -> WatchAll {
        WatchAll {
            encoderkeys_dict: encoderkeys_dict,
            tracker_store: ModifiedTrackerStore::default(),
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
        self.tracker_store.track("pos", &pos_storage);
        self.tracker_store.track("char_state", &char_state_storage);
        let mut state_vec = vec![];
        //TODO should come up with a method to do this automatically
        for (entity, key, pos, _t) in (&entities, &key_storage, &pos_storage, self.tracker_store.get("pos")).join() {
            let mut sub_state_vec = vec![];
            let key_set_spritepos = self.encoderkeys_dict.encode("KEY_SET_SPRITE_POS");
            let char_state: Option<& CharStateMachine> = char_state_storage.get(entity);
            let key_assasin = self.encoderkeys_dict.encode("KEY_ASSASIN");
            let key_target_circle = self.encoderkeys_dict.encode("KEY_TARGET_CIRCLE");

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
        self.tracker_store.clear("pos");
    }

    fn setup(&mut self, res: &mut Resources) {
        Self::SystemData::setup(res);
        let pos_reader_id = Some(WriteStorage::<types::Pt>::fetch(&res).register_reader());
        let char_reader_id = Some(WriteStorage::<CharStateMachine>::fetch(&res).register_reader());
        self.tracker_store.init(
            vec![
            KeyReaderIdMapping { k: "pos", reader_id: pos_reader_id },
            KeyReaderIdMapping { k: "char_state", reader_id: char_reader_id }
        ]);
    }
}

#[derive(Default)]
pub struct UpdateChar {
    pub tracker_store: ModifiedTrackerStore,
}

impl<'a> System<'a> for UpdateChar {
    type SystemData = (Read<'a, resources::DeltaTime>,
                       ReadStorage<'a, Move>,
                       ReadStorage<'a, Speed>,
                       WriteStorage<'a, CharStateMachine>,
                       WriteStorage<'a, types::Pt>);

    fn run(&mut self, (delta, move_obj_storage, speed_storage, mut char_state_storage, mut pos_storage): Self::SystemData) {
        self.tracker_store.track("move", &move_obj_storage);
        let mut clear: Vec<u32> = Vec::new();
        let dt = delta.0;
        for (move_obj, pos, speed, event) 
            in (
                &move_obj_storage, 
                &mut pos_storage, 
                &speed_storage, 
                self.tracker_store.get("move")).join() {
            let pos_clone = pos.clone();
            let nextpos_def = move_obj.next(dt, &pos_clone, speed.value());
            pos.x = nextpos_def.pt.x;
            pos.y = nextpos_def.pt.y;
            if nextpos_def.completed {
                clear.push(event);
            }
        }

        for event in clear {
            self.tracker_store.get_mut("move").remove(event);
        }

    }
    fn setup(&mut self, res: &mut Resources) {
        Self::SystemData::setup(res);
        let move_reader_id = Some(WriteStorage::<Move>::fetch(&res).register_reader());
        self.tracker_store.init(
            vec![
            KeyReaderIdMapping { k: "move", reader_id: move_reader_id },
        ]);
    }
}
