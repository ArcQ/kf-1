/// base types
pub struct Pt {
    pub x: f32,
    pub y: f32
}

impl Pt {
    pub fn new(x: f32, y: f32) -> Pt {
        Pt { x: x, y: y }
    }
    pub fn origin() -> Pt {
        Pt { x: 0.0, y: 0.0 }
    }
    pub fn clone(&self) -> Pt { Pt { x: self.x, y: self.y } }
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn from_slice() {
        let testPt = Pt::from_slice([1.0, 2.0]);
        assert_eq!(1.0, testPt.x);
        assert_eq!(2.0, testPt.y);
    }
}
