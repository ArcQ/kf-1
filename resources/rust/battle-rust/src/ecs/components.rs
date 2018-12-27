use specs::{Component, VecStorage, FlaggedStorage};
use super::types;
use wasm_bindgen::prelude::*;

// You need to bring the type into scope to use it!!!
use std::string::ToString;

#[wasm_bindgen]
extern "C" {
    type cljs_wasm_adapter;

    #[wasm_bindgen(static_method_of = cljs_wasm_adapter)]
    fn update(name: i32);
    
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u32(a: u32);
    
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_f32(a: f32);
}


impl Component for types::Pt {
    type Storage = FlaggedStorage<Self, VecStorage<Self>>;
}

#[derive(Display, Debug)]
pub enum CharState {
    IDLE,
    MOVE,
    BLINK,
    SPOT_ATTACK,
}

#[derive(Debug)]
pub struct CharStateMachine {
    pub state: CharState,
}

impl CharStateMachine {
    pub fn set_state(&mut self, new_state: CharState ) {
        self.state = new_state;
    }
}

impl Component for CharStateMachine {
    type Storage = VecStorage<Self>;
}

#[derive(Debug)]
pub struct Speed(f32); 

impl Speed {
    pub fn new(speed: f32) -> Speed {
        Speed(speed)
    }
    pub fn value(&self) -> f32 {
        self.0
    }
}

impl Component for Speed {
    type Storage = VecStorage<Self>;
}

#[derive(Debug)]
pub struct Key(pub i32); 

impl Key {
    pub fn new(k: i32) -> Key {
        Key(k)
    }
}

impl Component for Key {
    type Storage = VecStorage<Self>;
}

pub struct NextPosDef {
    pub pt: types::Pt,
    pub completed: bool,
}

pub struct Move {
    diff: types::Pt,
    normalized: types::Pt,
    multipliers: types::Pt,
    pub destination: types::Pt,
}

impl Move {
    pub fn new() -> Move {
        Move { 
            diff: types::Pt::origin(), 
            normalized: types::Pt::origin(), 
            multipliers: types::Pt::origin(), 
            destination: types::Pt::origin() 
        }
    }
    fn check_if_past(& self, next_pt: &types::Pt) -> bool {
        let is_past_pt_struct = self.diff.map_with(&next_pt, |diff_prop, next_pt_prop, k| -> f32 {
            if (self.destination.get_key_string(k) - next_pt_prop).signum() != (diff_prop).signum() 
            { -1.0 } else  { 0.0 }
        });
        (is_past_pt_struct.x < 0.0 || is_past_pt_struct.y < 0.0)
    }
    pub fn calc_new_dest(&mut self, _speed: f32, pos: &types::Pt, destination_slice: [f32; 2]) {
        self.destination = types::Pt::from_slice(destination_slice);
        log_f32(self.destination.x);
        log_f32(self.destination.y);
        self.diff = self.destination.sub(&pos);
        self.normalized = types::Pt::new(self.diff.x / self.diff.x.abs(), self.diff.x / self.diff.x.abs());
        let rad = (self.diff.y / self.diff.x).atan(); 
        self.multipliers = types::Pt::new(rad.cos(), rad.sin());
    }
    pub fn next(&self, dt: f32, cur_pos: &types::Pt, speed: f32) -> NextPosDef {
        let dist = speed *  dt * 10.0;
        let move_diff = self.multipliers.map_with(&self.normalized, |multipliers_prop, normalized_prop, _| {
            multipliers_prop * normalized_prop * dist
        });
        let next_pt = cur_pos.add(&move_diff);
        let next_pos_def = if self.check_if_past(&next_pt) {
            NextPosDef { completed: true, pt: self.destination.clone() }
        } else {
            NextPosDef { completed: false, pt: next_pt }
        };
        next_pos_def
    }
}

impl Component for Move {
    type Storage = FlaggedStorage<Self, VecStorage<Self>>;
}
