use specs::{ReadStorage,
System, WriteStorage};
use types;
use types::{CoderKeyMapping};
use specs::prelude::*;
use utils::js_imports;
use super::utils::{ModifiedTrackerStore, EncodedMessageBuilder, KeyReaderIdMapping};

use components::basic::{Key, CharStateMachine, Orientation};

pub struct BroadcastUpdatesSystem {
    pub tracker_store: ModifiedTrackerStore,
    pub encoded_message_builder: EncodedMessageBuilder,
}

impl <'a> BroadcastUpdatesSystem {
    pub fn new(encoderkeys_dict: CoderKeyMapping) -> BroadcastUpdatesSystem {
        BroadcastUpdatesSystem {
            tracker_store: ModifiedTrackerStore::default(),
            encoded_message_builder: EncodedMessageBuilder::new(encoderkeys_dict)
        }
    }
}

impl<'a> System<'a> for BroadcastUpdatesSystem {
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
