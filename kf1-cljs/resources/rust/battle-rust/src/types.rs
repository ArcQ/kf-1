/// base types
pub struct Pt([f32, 2]);


/// game types
pub struct Config {}
pub struct GameState { }

enum COMMANDS {
    Move,
    Target,
    UseSkill,
}
