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
    fn update(name: i32);
    
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);


    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);
}

impl<'a> System<'a> for WatchAll {
    type SystemData = (
        ReadStorage<'a, Key>,
        ReadStorage<'a, types::Pt>,
        ReadStorage<'a, CharStateStore>);

    fn run(&mut self, (name, pos, charStateStore): Self::SystemData) {
        // js_watcher.call3(name, pos, charStateStore);

        for name in name.join() {
            cljs_wasm_adapter::update(name.0);
        }
    }
}

#[derive(Default)]
pub struct UpdateChar {
    // These keep track of where you left off in the event channel.
    pub reader_id: Option<ReaderId<ComponentEvent>>,

    // The bitsets you want to populate with modification/insertion events.
    pub modified: BitSet,
    pub inserted: BitSet,
}

impl<'a> System<'a> for UpdateChar {
    type SystemData = (ReadStorage<'a, Move>,
                       ReadStorage<'a, Speed>,
                       WriteStorage<'a, types::Pt>);

    fn run(&mut self, (move_obj, speed, mut pos): Self::SystemData) {
        use specs::Join;

        self.modified.clear();
        self.inserted.clear();

        if let Some(r_id) = self.reader_id.as_mut() {
            let events = move_obj.channel()
                .read(r_id);
            for event in events {
                match event {
                    ComponentEvent::Modified(id) => { self.modified.add(*id); },
                    ComponentEvent::Inserted(id) => { self.inserted.add(*id); },
                    _ => { },
                };
            }
        }

        for (move_obj, pos, _) in (&move_obj, &mut pos, &self.modified).join() {
            // let pos_clone = pos.clone();
            // let new_pos = move_obj.next(0.006, &pos_clone, speed.value());
            // pos.x = new_pos.x;
            // pos.y = new_pos.y;
        }

        for (move_obj, speed, pos) in (&move_obj, &speed, &mut pos).join() {
            // log_u32(pos.x as u32);
            // log_u32(pos.y as u32);
        }
    }
    fn setup(&mut self, res: &mut Resources) {
        Self::SystemData::setup(res);
        self.reader_id = Some(WriteStorage::<Move>::fetch(&res).register_reader());
        self.modified = BitSet::new();
        self.inserted = BitSet::new();
    }
}
