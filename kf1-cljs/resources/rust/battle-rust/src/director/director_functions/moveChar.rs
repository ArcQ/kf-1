use std::num;
use std::f32;

// A struct with two fields
struct BasicTraits {
    pos: [f32; 2],
    speed: f32,
    sprite: String,
}

struct CharTraits {
    basic: CharTraits,
}

fn checkIfPastF(diff: [f32; 2], destination: [f32; 2]) -> bool {
    const greaterThanZero = |d| { d > 0 } ;
    |nextPt:[f32; 3]| {
        diff.map(|s, i| { 
            greaterThanZero(destination[i] - nextPt.get(i))  !== greaterThanZero(s)
        })
        .fold(false, |acc, v| { v || acc })
    }
}

fn movePt(pt: [f32; 2], diff: [f32; 2]) {
    [ptA[0] + diff[1], ptB[1] + moveDiff[1]]
}

pub fn move (traits: CharTraits, destination: [f32; 2]) {
    let diff = traits.pos.into_iter().map(|v: f32| { v - destination });
    let normalized = diff.into_iter().map(|x: f32| { diff[0] / diff[0].abs() });
    let rad = (diff[1] / diff[0]).atan(); 
    let multipliers = [
        rad.cos(),
        rad.sin(),
    ];
    
    let checkIfPast = checkIfPastF(diff, destination);

    |curPos: [f32; 2], dt: f32| {
        let dist = traits.speed * dt * 5;
        let moveDiff = multipliers.into_iter.map(|m, i| m * dist * normalized[i]);
        let nextPt = movePt(curPos, moveDiff);
        if checkIfPast(nextPt) {
            destination
        } else {
            nextPt
        }
    }
}
