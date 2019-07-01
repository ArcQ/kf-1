use types;
use wasm_bindgen::prelude::*;
/// Rust Implementation of the string to key mapping defined in rendering app used for encoding
/// keys between the communication of rust to js
pub struct CoderKeyMapping {
    pub keys: Vec<String>,
}

impl CoderKeyMapping {
    pub fn new(js_arr: &js_sys::Array) -> CoderKeyMapping {
        let mut key_mapping: Vec<String> = Vec::new();
        js_arr.map(&mut |k: JsValue, i: u32, _arr: js_sys::Array| -> JsValue {
            key_mapping.insert(
                i as usize,
                k.clone().as_string().unwrap(),
            );
            JsValue::from(0)
        });

        CoderKeyMapping {
            keys: key_mapping,
        }
    }
    pub fn encode(&self, find_k: &str) -> i32 {
        self.keys
            .iter()
            .position(|k| k == find_k)
            .unwrap() as i32
    }
    pub fn decode(&self, num: u16) -> &str {
        &self.keys[num as usize]
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
