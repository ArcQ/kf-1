use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    type cljs_wasm_adapter;

    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_f32(a: f32);
}

/// base types
#[derive(Default)]
pub struct Pt {
    pub x: f32,
    pub y: f32
}

impl Pt {
    pub fn new(x: f32, y: f32) -> Pt {
        Pt { x: x, y: y }
    }
    // pub fn origin() -> Pt {
    //     Pt { x: 0.0, y: 0.0 }
    // }
    pub fn from_slice(pt_slice: [f32;2]) -> Pt {
        Pt { x: pt_slice[0 as usize],  y: pt_slice[1 as usize] }
    }

    // pub fn toSlice(self) -> &mut f32 {
    //     &mut [self.x, self.y]
    // }
    /// get x or y based on a string key of x or y
    pub fn get_key_string(&self, k: &str) -> f32 {
        match k {
            "x" => self.x,
            "y" => self.y,
            _ => self.y
        }
    }
    /// maps over x and y, runs the handler fn(self.x|y , x|y) on each and returns a new pt
    // pub fn map<F>(&self, handler: F) -> Pt where F: Fn(f32, &str) -> f32 {
    //    Pt::new(handler(self.x, "x"), handler(self.y, "y"))
    // }
    /// map, but just run f with anther pt, handler fn(self.x|y , x|y)
    pub fn map_with<F>(&self, pt2: &Pt, handler: F) -> Pt where F: Fn(f32, f32, &str) -> f32 {
       Pt::new(handler(self.x, pt2.x, "x"), handler(self.y, pt2.y, "y"))
    }
    /// add this point with another point x+x y+y
    pub fn add(&self, diff: &Pt) -> Pt {
        self.map_with(&diff, |s, d, _| { s + d })
    }
    ///  another point subctract from this point x-x y-y
    pub fn sub(&self, diff: &Pt) -> Pt {
        self.map_with(&diff, |s, d, _| { s - d })
    }
}

impl Clone for Pt {
    fn clone(&self) -> Pt { Pt { x: self.x, y: self.y } }
}

/// Rust Implementation of the string to key mapping defined in clojurescript used for encoding
/// keys between the communication of rust to js
pub struct CoderKeyMapping {
    pub keys: Vec<String>,
}

impl CoderKeyMapping {
    pub fn new(js_arr: &js_sys::Array) -> CoderKeyMapping {
        let mut key_mapping: Vec<String> = Vec::new();
        js_arr.map(&mut |k: JsValue, i: u32, _arr: js_sys::Array| -> JsValue {
            log(&k.clone().as_string().unwrap());
            log_f32(i as f32);
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

#[derive(Default)]
pub struct GameMap {
    bounds: [usize;2],
    scale: f32,
    map: Vec<Vec<i32>>,
}

impl GameMap {
    pub fn clone(&self) -> GameMap {
        GameMap {
            map: self.map.clone(), 
            bounds: self.bounds,
            scale: self.scale,
        }
    }
    pub fn from_js_array(js_game_map: &wasm_bindgen::JsValue, scale: f32) -> GameMap {
        let game_map_array: js_sys::Array = js_sys::Array::from(js_game_map);
        let mut map_vec = vec![];
        for (i, row_result) in game_map_array.values().into_iter().enumerate() {
            if let Ok(row) = row_result {
                let row_arr = js_sys::Array::from(&row);
                let mut row_vec = vec![]; 
                for (i, v_result) in row_arr.values().into_iter().enumerate() {
                    if let Ok(v) = v_result {
                        row_vec.insert(i, v.as_f64().unwrap() as i32);
                    }
                }
                map_vec.insert(i, row_vec);
            }
        }
        let mut inner_vec_len = 0;
        let outer_vec_len = map_vec.len();
        if let Some(inner_vec) = map_vec.get(0) {
            inner_vec_len = inner_vec.len();
        };
        GameMap {
            map: map_vec, 
            bounds: [inner_vec_len, outer_vec_len],
            scale: scale,
        }
    }
    fn get(&self, x: i32, y: i32) -> Option<&i32> {
        let mut v = None;
        if let Some(row) = self.map.get(y as usize) {
            v = row.get(x as usize)
        };
        v 
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn pt_new() {
        let test_pt = Pt::new(1.0, 2.0);
        assert_eq!(1.0, test_pt.x);
        assert_eq!(2.0, test_pt.y);
    }
    
    #[test]
    fn pt_origin() {
        let test_pt = Pt::origin();
        assert_eq!(0.0, test_pt.x);
        assert_eq!(0.0, test_pt.y);
    }

    #[test]
    fn pt_from_slice() {
        let test_pt = Pt::from_slice([1.0, 2.0]);
        assert_eq!(1.0, test_pt.x);
        assert_eq!(2.0, test_pt.y);
    }
    
    #[test]
    fn pt_clone() {
        let mut test_pt = Pt::new(1.0, 2.0);
        let test_pt_cloned = test_pt.clone();
        test_pt.x = 2.0;
        assert_eq!(2.0, test_pt.x);
        assert_eq!(1.0, test_pt_cloned.x);
    }
    
    #[test]
    fn pt_get_key_string() {
        let test_pt = Pt::new(1.0, 2.0);
        
        assert_eq!(1.0, test_pt.get_key_string("x"));
        assert_eq!(2.0, test_pt.get_key_string("y"));
    }
    
    #[test]
    fn pt_map_with() {
        let test_pt = Pt::new(1.0, 2.0);
        let test_pt_two = Pt::new(3.0, 4.0);
        let mapped = test_pt.map_with(&test_pt_two, |p1, p2, k| -> f32 {
            (p1 + p2) / test_pt.get_key_string(&k)
        });
        
        assert_eq!(4.0, mapped.x);
        assert_eq!(3.0, mapped.y);
    }
    
    #[test]
    fn pt_add() {
        let test_pt = Pt::new(1.0, 2.0);
        let test_pt_two = Pt::new(3.0, 4.0);
        let added = test_pt.add(&test_pt_two);
        
        assert_eq!(4.0, added.x);
        assert_eq!(6.0, added.y);
    }
    
    #[test]
    fn pt_sub() {
        let test_pt = Pt::new(1.0, 2.0);
        let test_pt_two = Pt::new(3.0, 4.0);
        let subbed = test_pt.sub(&test_pt_two);
        
        assert_eq!(-2.0, subbed.x);
        assert_eq!(-2.0, subbed.y);
    }
}
