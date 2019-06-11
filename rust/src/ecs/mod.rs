use std::collections::HashMap;
use specs::{ReadStorage,
System, WriteStorage, ReaderId, Entities, Component, Tracked};
use specs::storage::ComponentEvent;
use super::types;
use super::types::{CoderKeyMapping};
use specs::prelude::*;
use super::js_imports;

pub mod components;
pub mod resources;

use self::components::{Key, Move, Speed, CharState, CharStateMachine, Orientation};

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
}

pub struct EncodedMessageBuilder {
    pub encoderkeys_dict: CoderKeyMapping,
    pub state_vec: Vec<f32>,
    pub sub_state_vec: Vec<f32>,
}

impl EncodedMessageBuilder {
    pub fn new(encoderkeys_dict: CoderKeyMapping) -> EncodedMessageBuilder {
        EncodedMessageBuilder {
            encoderkeys_dict: encoderkeys_dict,
            state_vec: vec![],
            sub_state_vec: vec![]
        }
    }
    pub fn reset(&mut self) {
        self.state_vec = vec![];
        self.sub_state_vec = vec![];
    }
    pub fn push_str(&mut self, s: &str) {
        let encoded = self.encoderkeys_dict.encode(s);
        self.sub_state_vec.push(encoded as f32);
    }
    pub fn push_i32(&mut self, num: i32) {
        self.sub_state_vec.push(num as f32);
    }
    pub fn push(&mut self, num: f32) {
        self.sub_state_vec.push(num);
    }
    pub fn push_pt(&mut self, pt: &types::Pt) {
        self.sub_state_vec.push(pt.x as f32);
        self.sub_state_vec.push(pt.y as f32);
    }
    pub fn finalize_sub_state(&mut self) {
        let sub_state_vec_len = self.sub_state_vec.len();
        if self.sub_state_vec.len() > 0 {
            self.sub_state_vec.insert(0 as usize, (sub_state_vec_len + 1) as f32);
            self.state_vec.append(&mut self.sub_state_vec);
            self.sub_state_vec = vec![];
        }
    }
    pub fn get_finalized_boxed(&mut self) -> Option<Box<[f32]>> {
        let state_vec_len = self.state_vec.len();
        if state_vec_len > 0 {
            self.state_vec.insert(0 as usize, (state_vec_len + 1) as f32);
            Some(self.state_vec.clone().into_boxed_slice())
        } else {
            None
        }
    }
}

pub struct WatchAll {
    pub tracker_store: ModifiedTrackerStore,
    pub encoded_message_builder: EncodedMessageBuilder,
}

impl <'a> WatchAll {
    pub fn new(encoderkeys_dict: CoderKeyMapping) -> WatchAll {
        WatchAll {
            tracker_store: ModifiedTrackerStore::default(),
            encoded_message_builder: EncodedMessageBuilder::new(encoderkeys_dict)
        }
    }
}

impl<'a> System<'a> for WatchAll {
    type SystemData = (
        ReadStorage<'a, CharStateMachine>,
        ReadStorage<'a, Key>,
        ReadStorage<'a, types::Pt>,
        ReadStorage<'a, Orientation>);

    fn run(&mut self, system_data: Self::SystemData) {
        let (char_state_storage, key_storage, pos_storage, orientation_storage) = system_data;
        self.encoded_message_builder.reset();
        self.tracker_store.track("pos", &pos_storage);
        self.tracker_store.track("char_state", &char_state_storage);
        self.tracker_store.track("orientation", &orientation_storage);

        // positions
        for (key, pos, _) in (&key_storage, &pos_storage, self.tracker_store.get("pos")).join() {
            self.encoded_message_builder.push_str("SET_SPRITE_POS");
            self.encoded_message_builder.push_i32(key.0);
            self.encoded_message_builder.push_pt(pos);
            self.encoded_message_builder.finalize_sub_state();
        }

        for (char_state, _) in (&char_state_storage, self.tracker_store.get("char_state")).join() {
            self.encoded_message_builder.push_str("SET_CHAR_STATE");
            self.encoded_message_builder.push_str("P1");
            self.encoded_message_builder.push_str(&char_state.get_state_as_string());
            self.encoded_message_builder.finalize_sub_state();
        }
        
        for (orientation, _) in (&orientation_storage, self.tracker_store.get("orientation")).join() {
            self.encoded_message_builder.push_str("CHANGE_ORIENTATION");
            self.encoded_message_builder.push_str("P1");
            self.encoded_message_builder.push(orientation.0);
            self.encoded_message_builder.finalize_sub_state();
        }

        if let Some(encoded_message) = self.encoded_message_builder.get_finalized_boxed() {
            js_imports::js_wasm_adapter::update(encoded_message);
        }

        self.tracker_store.clear("char_state");
        self.tracker_store.clear("orientation");
        self.tracker_store.clear("pos");
    }

    fn setup(&mut self, res: &mut Resources) {
        Self::SystemData::setup(res);
        let pos_reader_id = Some(WriteStorage::<types::Pt>::fetch(&res).register_reader());
        let char_reader_id = Some(WriteStorage::<CharStateMachine>::fetch(&res).register_reader());
        let orientation_reader_id = Some(WriteStorage::<Orientation>::fetch(&res).register_reader());
        self.tracker_store.init(
            vec![
            KeyReaderIdMapping { k: "pos", reader_id: pos_reader_id },
            KeyReaderIdMapping { k: "char_state", reader_id: char_reader_id },
            KeyReaderIdMapping { k: "orientation", reader_id: orientation_reader_id }
            ]);
    }
}

#[derive(Default)]
pub struct MoveSystem {
    pub tracker_store: ModifiedTrackerStore,
}

impl<'a> System<'a> for MoveSystem {
    type SystemData = (Entities<'a>,
                       Read<'a, resources::DeltaTime>,
                       ReadStorage<'a, Move>,
                       ReadStorage<'a, Speed>,
                       WriteStorage<'a, CharStateMachine>,
                       WriteStorage<'a, types::Pt>);

    fn run(&mut self, (entities, delta, move_obj_storage, speed_storage, mut char_state_storage, mut pos_storage): Self::SystemData) {
        self.tracker_store.track("move", &move_obj_storage);
        let mut clear: Vec<u32> = Vec::new();
        let dt = delta.0;
        let mut set_char_state_idle = |entity| {
            if let Some(char_state) = char_state_storage.get_mut(entity) {
                char_state.0 = CharState::IDLE;
            }
        };
        for (entity, 
             move_obj, 
             pos, 
             speed,
             event) 
            in (&entities,
                &move_obj_storage, 
                &mut pos_storage, 
                &speed_storage, 
                self.tracker_store.get("move")).join() {
                let pos_clone = pos.clone();
                let nextpos_def = move_obj.next(dt, &pos_clone, speed.0);
                pos.x = nextpos_def.pt.x;
                pos.y = nextpos_def.pt.y;
                if nextpos_def.completed {
                    // if let Some(char_state) = char_state_storage.get_mut(entity) {
                    //     char_state.set_state(CharState::IDLE);
                    // }
                    set_char_state_idle(entity);
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

#[derive(Default)]
pub struct UpdateChar {
    pub tracker_store: ModifiedTrackerStore,
}

impl<'a> System<'a> for UpdateChar {
    type SystemData = (Entities<'a>,
                       Read<'a, resources::DeltaTime>,
                       ReadStorage<'a, Move>,
                       ReadStorage<'a, Speed>,
                       WriteStorage<'a, CharStateMachine>,
                       WriteStorage<'a, types::Pt>);

    fn run(&mut self, (entities, delta, move_obj_storage, speed_storage, mut char_state_storage, mut pos_storage): Self::SystemData) {
        self.tracker_store.track("move", &move_obj_storage);
        let mut clear: Vec<u32> = Vec::new();
        let dt = delta.0;
        let mut set_char_state_idle = |entity| {
            if let Some(char_state) = char_state_storage.get_mut(entity) {
                char_state.0 = CharState::IDLE;
            }
        };
        for (entity, 
             move_obj, 
             pos, 
             speed,
             event) 
            in (&entities,
                &move_obj_storage, 
                &mut pos_storage, 
                &speed_storage, 
                self.tracker_store.get("move")).join() {
                let nextpos_def = move_obj.next(dt, &pos.clone(), speed.0);
                pos.x = nextpos_def.pt.x;
                pos.y = nextpos_def.pt.y;
                if nextpos_def.completed {
                    set_char_state_idle(entity);
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
