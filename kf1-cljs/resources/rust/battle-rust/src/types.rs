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
