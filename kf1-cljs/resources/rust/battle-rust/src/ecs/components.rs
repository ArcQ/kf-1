use specs::{Component, VecStorage, FlaggedStorage};
use super::types;

impl Component for types::Pt {
    type Storage = FlaggedStorage<Self, VecStorage<Self>>;
}

#[derive(Debug)]
pub enum CharState {
    Idle,
    Move,
    Attack,
}

pub struct CharStateStore {
    base_state: CharState
}

impl Component for CharStateStore {
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

pub struct Move {
    pub diff: types::Pt,
    normalized: types::Pt,
    multipliers: types::Pt,
    destination: types::Pt,
}

impl Move {
    fn greater_than_zero(d: f32) -> bool { 
        d > 0.0 
    }
    fn check_if_past(& self, nextPt: &types::Pt) -> bool {
        let isPastPtStruct = self.diff.mapWith(&nextPt, |diffProp, nextPtProp, k| -> f32 {
            let result = 
                if Move::greater_than_zero(self.destination.getKeyString(k) - nextPtProp) != Move::greater_than_zero(diffProp) 
                { -1.0 } else  { 0.0 };
            result
        });
        let isPast = if isPastPtStruct.x < 0.0 || isPastPtStruct.y < 0.0 
        { true } else { false };
        isPast
    }
    pub fn new() -> Move {
        Move { 
            diff: types::Pt::origin(), 
            normalized: types::Pt::origin(), 
            multipliers: types::Pt::origin(), 
            destination: types::Pt::origin() 
        }
    }
    pub fn calc_new_dest(&mut self, speed: f32, pos: &types::Pt, destinationSlice: [f32; 2]) {
        self.destination = types::Pt::fromSlice(destinationSlice);
        self.diff = self.destination.sub(&pos);
        self.normalized = types::Pt::new(self.diff.x / self.diff.x.abs(), self.diff.x / self.diff.x.abs());
        let rad = (self.diff.y / self.diff.x).atan(); 
        self.multipliers = types::Pt::new(rad.cos(), rad.sin());
    }
    pub fn next(&self, dt: f32, curPos: &types::Pt, speed: f32) -> types::Pt {
        let dist = speed * dt * 5.0;
        let moveDiff = self.multipliers.mapWith(&self.normalized, |multipliersProp, normalizedProp, _| {
            multipliersProp * normalizedProp * dist
        });
        let nextPt = curPos.add(&moveDiff);
        let finalPt = if self.check_if_past(&nextPt) {
            self.destination.clone()
        } else {
            nextPt
        };
        finalPt
    }
}

impl Component for Move {
    type Storage = FlaggedStorage<Self, VecStorage<Self>>;
}
