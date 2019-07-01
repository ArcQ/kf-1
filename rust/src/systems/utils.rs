use std::collections::HashMap;
use specs::{ReadStorage, ReaderId, Component, Tracked};
use specs::storage::ComponentEvent;
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
