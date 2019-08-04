use specs::{ReadStorage,
System, WriteStorage, Entities};
use types;
use specs::prelude::*;
use resources::DeltaTime;
use super::utils::{ModifiedTrackerStore, KeyReaderIdMapping};

use components::basic::{Move, Speed, CharState, CharStateMachine};

#[derive(Default)]
pub struct MoveSystem {
    pub tracker_store: ModifiedTrackerStore,
}

impl<'a> System<'a> for MoveSystem {
    type SystemData = (Entities<'a>,
                       Read<'a, DeltaTime>,
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
