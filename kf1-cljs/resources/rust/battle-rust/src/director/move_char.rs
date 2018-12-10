use std::f32;
use super::types;

// A struct with two fields
struct BasicTraits {
    pos: types::Pt,
    speed: f32,
    sprite: String,
}

struct CharTraits {
    basic: BasicTraits,
}

pub fn run (traits: CharTraits, destinationSlice: [f32; 2]) -> impl Fn(f32, types::Pt) -> types::Pt {
    let destination = types::Pt::from_slice(destinationSlice);
    let diff = traits.basic.pos.sub(destination);
    let normalized = types::Pt::new(diff.x / diff.x.abs(), diff.x / diff.x.abs());
    let rad = (diff.y / diff.y).atan(); 
    let multipliers = types::Pt::new(rad.cos(), rad.sin());

    let greaterThanZero = |d| { d > 0.0 } ;
    let checkIfPast = |next_pt:types::Pt| -> bool {
        let isPastPtStruct = diff.map_with(next_pt, |diffProp, next_pt_prop, _| -> f32 {
            let result = 
                if greaterThanZero(diffProp - next_pt_prop) != greaterThanZero(diffProp) 
                { -1.0 } else  { 0.0 };
            result
        });
        let isPast = if isPastPtStruct.x < 0.0 || isPastPtStruct.y < 0.0 
        { true } else { false };
        isPast
    };

    |dt: f32, curPos: types::Pt| -> types::Pt {
        let dist = traits.basic.speed * dt * 5.0;
        let move_diff = multipliers.map_with(normalized, |multipliersProp, normalizedProp, _| {
            multipliersProp * normalizedProp * dist
        });
        let next_pt = curPos::add(move_diff);
        let finalPt = if checkIfPast(next_pt) {
            destination
        } else {
            next_pt
        };
        finalPt
    }
}
