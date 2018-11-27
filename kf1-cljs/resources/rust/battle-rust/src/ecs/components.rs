use specs::{Component, VecStorage};
use super::types;

#[derive(Debug)]
pub enum CharState {
    Idle,
    Move,
    Attack,
}

pub struct DestPt {
    pub x: f32,
    pub y: f32
}

impl Component for DestPt {
    type Storage = VecStorage<Self>;
}

impl Component for types::Pt {
    type Storage = VecStorage<Self>;
}

#[derive(Debug)]
pub struct CharType(i32); 

impl CharType {
    pub fn new(charType: i32) -> CharType {
        CharType(charType)
    }
}

impl Component for CharType {
    type Storage = VecStorage<Self>;
}

#[derive(Debug)]
pub struct Speed(f32); 

impl Speed {
    pub fn new(speed: f32) -> Speed {
        Speed(speed)
    }
}

impl Component for Speed {
    type Storage = VecStorage<Self>;
}

pub struct CharStateStore {
    base_state: CharState
}

impl Component for CharStateStore {
    type Storage = VecStorage<Self>;
}

#[derive(Debug)]
pub struct Id(pub i32); 

impl Id {
    pub fn new(name: i32) -> Name {
        Name(name)
    }
}

impl Component for  Name {
    type Storage = VecStorage<Self>;
}
