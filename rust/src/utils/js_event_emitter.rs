use utils::encoder::EncodedMessageBuilder;
use utils::js_imports;

pub struct JsEventEmitter {
    pub encoded_message_builder: EncodedMessageBuilder,
    pub broadcast_unchanged: bool,
}

impl <'a> JsEventEmitter {
    pub fn broadcast_to_js(&mut self) {
        if let Some(encoded_message) = self.encoded_message_builder.get_finalized_boxed() {
            js_imports::js_wasm_adapter::update(encoded_message);
        } else if self.broadcast_unchanged {
            self.broadcast_no_change();
        }
    }
    fn broadcast_no_change(&mut self) {
        self.encoded_message_builder.push_str("NO_CHANGE");
        self.encoded_message_builder.finalize_sub_state();
        self.broadcast_to_js(); 
    }
}


