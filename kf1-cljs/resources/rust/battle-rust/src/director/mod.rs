pub fn updateGameState(gameState: GameState) {
    return  |jsKvArray: [i32]| {

    }
}

fn moveCharF(gameState: types::GameState, inputDef: types) {
    start(gameState, inputDef);
    moveChar(inputDef.key, gameState, dt, inputDef.pos);
    end(gameState, inputDef);
}

pub fn control(gameState: GameState, dt: f32, inputDef: InputDef, ) {
    return fn (jsKvArray: [i32]) {
        match inputDef.key {
            "charMove" =>  wrapInStartEnds
        }
    }
}

pub mod update_interface {
    pub fn tick(dt: f32, input_def: types::InputDef) {
        if (input_def) {

        }
    }
}
