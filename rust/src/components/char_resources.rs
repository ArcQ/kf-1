use specs::{Component, VecStorage};

trait CharResource {
    fn new(max: f32) -> Self;
    fn set(&mut self, value: f32);
    fn get(&self) -> f32; 
    fn get_max(&self) -> f32;
    fn get_percentage(&self) -> f32 { 
        self.get()/self.get_max() * 100.0
    }
    fn dec(&mut self, val: f32) {
        let mut new_value = self.get() + val;
        if new_value < 0.0 {
            new_value = 0.0;
        }
        self.set(new_value);
    }
    fn inc(&mut self, val: f32) {
        let new_value = self.get() + val;
        if new_value > self.get_max() {
            self.get_max();
        }
        self.set(new_value);
    }
}

#[derive(Debug)]
pub struct  Health{
    value: f32,
    max: f32,
}

impl Component for Health {
    type Storage = VecStorage<Self>;
}

impl CharResource for Health {
    fn new(max: f32) -> Health {
        Health {
            value: max,
            max: max
        }
    }
    fn set(&mut self, value: f32) {
        self.value = value;
    }
    fn get(&self) -> f32 {
        self.value
    }
    fn get_max(&self) -> f32{
        self.max
    }
}
