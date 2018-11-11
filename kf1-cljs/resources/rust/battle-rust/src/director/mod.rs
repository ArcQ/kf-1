mod move_char;
use super::types;

fn move_char_f(dt: f32, input_def: &[f32]) {
    move_char::run(dt, types::Pt::new(input_def[1], input_def[2]));
}

fn wrap_in_start_end<F>(dt: f32, value: &[f32], run: F) where F: Fn(f32, &[f32]) {
    start(gameState, inputDef);
    run(dt, value);
    end(gameState, inputDef);
}

pub mod update_interface {
    pub fn tick(dt: f32, input_def: &[f32]) {
        // set state based on input, manual characters
        let new_f = match input_def[0] {
            0.0 =>  wrap_in_start_end(dt, input_def, move_char_f)
        }

        // if there are update functions to run, run them
    }
}
