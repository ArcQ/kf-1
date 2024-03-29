use specs::{Component, VecStorage, FlaggedStorage};
use types::{Pt, GameMap};

impl Component for Pt {
    type Storage = FlaggedStorage<Self, VecStorage<Self>>;
}

#[allow(non_camel_case_types)]
#[derive(Display, Debug)]
pub enum CharState {
    IDLE,
    MOVE,
    SPOT_ATTACK,
}

#[derive(Debug)]
pub struct CharStateMachine(pub CharState);

impl CharStateMachine {
    pub fn get_state_as_string(&self) -> String {
        self.0.to_string()
    }
}

impl Component for CharStateMachine {
    type Storage = FlaggedStorage<Self, VecStorage<Self>>;
}

#[derive(Debug)]
pub struct Orientation(pub f32); 

impl Component for Orientation {
    type Storage = FlaggedStorage<Self, VecStorage<Self>>;
}

#[derive(Debug)]
pub struct Speed(pub f32); 

impl Component for Speed {
    type Storage = VecStorage<Self>;
}

#[derive(Debug)]
pub struct Key(pub i32); 

impl Component for Key {
    type Storage = VecStorage<Self>;
}

pub struct NextPosDef {
    pub pt: Pt,
    pub completed: bool,
}

#[derive(Default)]
pub struct Move {
    diff: Pt,
    normalized: Pt,
    multipliers: Pt,
    destination: Pt,
    // TODO should borrow this, not keep seperate copies everywhere
    game_map: GameMap,
    is_stopped: bool,
}

impl Move {
    pub fn new(game_map: GameMap) -> Move {
        let mut move_obj = Move::default();
        move_obj.game_map = game_map;
        move_obj
    }
    fn check_if_past(& self, next_pt: &Pt) -> bool {
        let is_past_pt_struct = self.diff.map_with(&next_pt, |diff_prop, next_pt_prop, k| -> f32 {
            if (self.destination.get_key_string(k) - next_pt_prop).signum() != (diff_prop).signum() 
            { -1.0 } else  { 0.0 }
        });
        (is_past_pt_struct.x < 0.0 || is_past_pt_struct.y < 0.0)
    }
    pub fn get_x_direction(&self) -> f32 {
        if self.diff.x > 0.0 
            { 1.0 } else  { 2.0 }
    }
    pub fn calc_new_dest(&mut self, _speed: f32, pos: &Pt, destination: Pt) {
        self.is_stopped = false;
        self.destination = destination;
        self.diff = self.destination.sub(&pos);
        self.normalized = Pt::new(self.diff.x / self.diff.x.abs(), self.diff.x / self.diff.x.abs());
        let rad = (self.diff.y / self.diff.x).atan(); 
        self.multipliers = Pt::new(rad.cos(), rad.sin());
    }
    pub fn stop(&mut self) {
        self.is_stopped = true;
    }
    pub fn next(&self, dt: f32, cur_pos: &Pt, speed: f32) -> NextPosDef {
        if self.is_stopped == true {
            return NextPosDef { completed: true, pt: cur_pos.clone() }
        }
        let dist = speed *  dt * 10.0;
        let move_diff = self.multipliers.map_with(&self.normalized, |multipliers_prop, normalized_prop, _| {
            multipliers_prop * normalized_prop * dist
        });
        
        let next_pt = cur_pos.add(&move_diff);

        let next_pos_def = if self.game_map.eq_by_pt(&next_pt, 3) {
            NextPosDef { completed: false, pt: cur_pos.clone() }
        } else if self.check_if_past(&next_pt) {
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

