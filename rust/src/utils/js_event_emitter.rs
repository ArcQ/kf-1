use utils::js_imports;
use utils::encoder::EncodedMessageBuilder;

pub struct JsEventEmitter {
    pub encoded_message_builder: EncodedMessageBuilder,
}

impl <'a> JsEventEmitter {
    pub fn broadcast_to_js(&mut self) {
        if let Some(encoded_message) = self.encoded_message_builder.get_finalized_boxed() {
            js_imports::js_wasm_adapter::update(encoded_message);
        }
    }
}


