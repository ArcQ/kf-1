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

fn getPtFromSlice(ptSlice: [f32;2]) -> types::Pt {
    types::Pt { x: ptSlice[0 as usize],  y: ptSlice[1 as usize] }
}

pub fn run (traits: CharTraits, destinationSlice: [f32; 2]) -> impl Fn(f32, types::Pt) -> types::Pt {
    let destination = types::Pt::fromSlice(destinationSlice);
    let diff = traits.basic.pos.sub(destination);
    let normalized = types::Pt::new(diff.x / diff.x.abs(), diff.x / diff.x.abs());
    let rad = (diff.y / diff.y).atan(); 
    let multipliers = types::Pt::new(rad.cos(), rad.sin());

    let greaterThanZero = |d| { d > 0.0 } ;
    let checkIfPast = |nextPt:types::Pt| -> bool {
        let isPastPtStruct = diff.mapWith(nextPt, |diffProp, nextPtProp, _| -> f32 {
            let result = 
                if greaterThanZero(diffProp - nextPtProp) != greaterThanZero(diffProp) 
                { -1.0 } else  { 0.0 };
            result
        });
        let isPast = if isPastPtStruct.x < 0.0 || isPastPtStruct.y < 0.0 
        { true } else { false };
        isPast
    };

    |dt: f32, curPos: types::Pt| -> types::Pt {
        let dist = traits.basic.speed * dt * 5.0;
        let moveDiff = multipliers.mapWith(normalized, |multipliersProp, normalizedProp, _| {
            multipliersProp * normalizedProp * dist
        });
        let nextPt = curPos::add(moveDiff);
        let finalPt = if checkIfPast(nextPt) {
            destination
        } else {
            nextPt
        };
        finalPt
    }
}
