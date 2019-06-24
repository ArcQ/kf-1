use std::collections::HashMap;
use specs::{ReadStorage, ReaderId, Component, Tracked};
use specs::storage::ComponentEvent;
use types;
use types::{CoderKeyMapping};
use specs::prelude::*;

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
