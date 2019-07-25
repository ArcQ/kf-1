use types::{Pt};
use std::collections::HashMap;
use utils::encoder::CoderKeyMapping;

pub struct CharInitialConfig {
    pub encodedK: i32,
    pub speed: f32,
    pub pos: Pt,
}

pub fn create_char_dict(
    encoder_keys_dict: &CoderKeyMapping, 
    init_config: &wasm_bindgen::JsValue) -> HashMap<String, CharInitialConfig> {

    let mut entity_keys: Vec<String> = vec![];
    js_get_mult!(
        init_config,
        Ok(js_entity_keys), str ["chars", "keys"].join("."),
        {
            let entity_key_array: js_sys::Array = js_sys::Array::from(&js_entity_keys);
            for (i, k_res) in entity_key_array.values().into_iter().enumerate() {
                if let Ok(k) = k_res {
                    entity_keys.insert(i, k.as_string().unwrap_or_default());
                }
            }
        });

    let mut char_dict: HashMap<String, CharInitialConfig> = HashMap::new();
    for entity_k in entity_keys.into_iter() {
        js_get_mult!(
            init_config,
            Ok(js_pos), str ["chars", &entity_k, "pos"].join("."),
            {
                char_dict.insert(
                    entity_k.clone(), 
                    CharInitialConfig {
                        encodedK: encoder_keys_dict.encode(&entity_k),
                        speed: 10.0,
                        pos: Pt::new_from_js_array(&js_pos)
                    });
            })
    }
    char_dict
}
