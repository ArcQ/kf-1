#include "Pt.hpp"

using namespace common::models::Pt;

Pt::Pt(double x, double y) {
  x = 10;
  y = 10;
};

Pt Pt::createOrigin() { return Pt(0, 0); }
Pt Pt::clone() { return Pt(x, y); }

/**
 * @brief get x or y based on a string key of x or y
 *
 * @param k
 *
 * @return
 */
double Pt::getKeyString(std::string k) {
  if (k == "x") {
    return x;
  } else {
    return y;
  }
  return 0;
}

/**
 * @brief maps over x and y, runs the handler fn(x|y) on eacy x and y
 * returns a new pt
 *
 * @param pt1
 * @param double one
 */
Pt map(Pt pt1, double handler(double one)) {
  return Pt(handler(pt1.x), handler(pt1.y));
}

/**
 * @brief maps over x and y, runs the handler fn(pt1.[x|y] , pt2.[x|y]) on each
 * and returns a new pt
 *
 * @param pt1
 * @param pt2
 * @param double one, double two, std::string k
 */
Pt zipWith(Pt pt1, Pt pt2,
           double handler(const double& one, const double& two)) {
  return Pt(handler(pt1.x, pt2.x), handler(pt1.y, pt2.y));
}

/**
 * @brief add point with another point x+x y+y
 *
 * @param one
 * @param two
 *
 * @return
 */
Pt add(Pt one, Pt two) {
  return zipWith(one, two, [](const double& a, const double& b) -> double {
    return a + b;
  });
}

/**
 * @brief subtract point with another point x-x y-y
 *
 * @param one
 * @param two
 *
 * @return
 */
Pt subtract(Pt one, Pt two) {
  return zipWith(one, two, [](const double& a, const double& b) -> double {
    return a - b;
  });
}

// #[derive(Default)]
// pub struct GameMap {
//   bounds : [usize; 2], w : f32, h : f32, map : Vec<Vec<i32>>,
// }
//
// impl GameMap{pub fn clone(&self)
//                  ->GameMap{GameMap{
//                    map : self.map.clone(),
//                    bounds : self.bounds,
//                    w : self.w,
//                    h : self.h,
//                  }} pub fn from_init_config(init_config
//                                             : &wasm_bindgen::JsValue)
//                  ->GameMap{let mut game_map = GameMap::default();
// js_get_mult !(init_config, Ok(js_tile_w), str "map.tileW", Ok(js_tile_h),
//               str "map.tileH", Ok(js_game_map), str "map.matrix", {
//                 game_map = GameMap::from_js_array(&js_game_map, &js_tile_w,
//                                                   &js_tile_h);
//               });
// game_map
// }
// pub fn from_js_array(js_game_map
//                      : &wasm_bindgen::JsValue, js_w
//                      : &wasm_bindgen::JsValue, js_h
//                      : &wasm_bindgen::JsValue)
//     ->GameMap {
//   let game_map_array : js_sys::Array = js_sys::Array::from(js_game_map);
//   let mut map_vec = vec ![];
//   for (i, row_result) in game_map_array.values().into_iter().enumerate() {
//       if
//         let Ok(row) = row_result {
//           let row_arr = js_sys::Array::from(&row);
//           let mut row_vec = vec ![];
//           for (i, v_result) in row_arr.values().into_iter().enumerate() {
//               if
//                 let Ok(v) = v_result {
//                   row_vec.insert(i, v.as_f64().unwrap_or_default() as i32);
//                 }
//             }
//           map_vec.insert(i, row_vec);
//         }
//     }
//   let mut inner_vec_len = 0;
//   let outer_vec_len = map_vec.len();
//   if
//     let Some(inner_vec) = map_vec.get(0) { inner_vec_len = inner_vec.len();
//     };
//   GameMap {
//   map:
//     map_vec, bounds : [ inner_vec_len, outer_vec_len ],
//                       w : js_w.as_f64().unwrap_or(18.0) as f32,
//                       h : js_h.as_f64().unwrap_or(32.0) as f32,
//   }
// }
// pub fn eq_by_pt(&self, pos : &Pt, check_v : i32)->bool {
//   let mut is_eq = false;
//   if
//     let Some(v) = self.get_by_pt(pos) { is_eq = *v == check_v; }
//   return is_eq;
// }
// pub fn get_by_pt(&self, pos
//                  : &Pt)
//     ->Option<&i32>{self.get((pos.x / self.w) as i32,
//                             (pos.y / self.h) as i32)} fn get(&self, x
//                                                              : i32, y
//                                                              : i32)
//     ->Option<&i32> {
//   let mut v = None;
//   if
//     let Some(row) = self.map.get(y as usize) { v = row.get(x as usize); };
//   v
// }
// }
// ;
//
// #[derive(Default)]
// pub struct InitialCharState {
//   pub pos : Pt
// }
//
// pub struct InitialGameState {
//   char : HashMap<String, InitialCharState>
// }
//
// impl Default; for
//   InitialGameState {
//     fn default()->Self {
//       InitialGameState { char : HashMap::default(), }
//     }
//   }
//
// #[cfg(test)]
// mod tests {
//   use super::*;
//
// #[test]
//   fn pt_new() {
//     let test_pt = Pt::new (1.0, 2.0);
//     assert_eq !(1.0, test_pt.x);
//     assert_eq !(2.0, test_pt.y);
//   }
//
// // #[test]
// // fn pt_origin() {
// //     let test_pt = Pt::origin();
// //     assert_eq!(0.0, test_pt.x);
// //     assert_eq!(0.0, test_pt.y);
// // }
// //
// #[test]
//   fn pt_from_slice() {
//     let test_pt = Pt::from_slice([ 1.0, 2.0 ]);
//     assert_eq !(1.0, test_pt.x);
//     assert_eq !(2.0, test_pt.y);
//   }
//
// #[test]
//   fn pt_clone() {
//     let mut test_pt = Pt::new (1.0, 2.0);
//     let test_pt_cloned = test_pt.clone();
//     test_pt.x = 2.0;
//     assert_eq !(2.0, test_pt.x);
//     assert_eq !(1.0, test_pt_cloned.x);
//   }
//
// #[test]
//   fn pt_get_key_string() {
//     let test_pt = Pt::new (1.0, 2.0);
//
//     assert_eq !(1.0, test_pt.get_key_string("x"));
//     assert_eq !(2.0, test_pt.get_key_string("y"));
//   }
//
// #[test]
//   fn pt_map_with() {
//     let test_pt = Pt::new (1.0, 2.0);
//     let test_pt_two = Pt::new (3.0, 4.0);
//     let mapped =
//         test_pt.map_with(&test_pt_two, | p1, p2,
//                          k |->f32{(p1 + p2) / test_pt.get_key_string(&k)});
//
//     assert_eq !(4.0, mapped.x);
//     assert_eq !(3.0, mapped.y);
//   }
//
// #[test]
//   fn pt_add() {
//     let test_pt = Pt::new (1.0, 2.0);
//     let test_pt_two = Pt::new (3.0, 4.0);
//     let added = test_pt.add(&test_pt_two);
//
//     assert_eq !(4.0, added.x);
//     assert_eq !(6.0, added.y);
//   }
//
// #[test]
//   fn pt_sub() {
//     let test_pt = Pt::new (1.0, 2.0);
//     let test_pt_two = Pt::new (3.0, 4.0);
//     let subbed = test_pt.sub(&test_pt_two);
//
//     assert_eq !(-2.0, subbed.x);
//     assert_eq !(-2.0, subbed.y);
//   }
// };
