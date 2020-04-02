#include "game_controller.hpp"  // header in local directory

#include <iostream>  // header in standard library
#include "components/c_basic.hpp"
#include "components/c_character_state.hpp"
#include "components/c_orientation.hpp"
#include <utility>

kf1::GameController::GameController(JsEventEmitter jsEventEmitter,
                                    models::GameMap gameMap,
                                    std::map<std::string,
                               CharacterInitialConfig> characterDict) {
  assign_entities(gameMap, characterDict);
}

void kf1::GameController::tick(double dt) {
//  registry.view<components::basic::CPosition, components::>().each([dt](auto &pos, auto &vel) {
//    pos.x += vel.dx * dt;
//    pos.y += vel.dy * dt;
//  });
}

void kf1::GameController::reset() {}

void kf1::GameController::assign_entities(models::GameMap map,
                                          std::map<std::string,
                                            CharacterInitialConfig> characterDict) {
  for (std::pair<std::string, CharacterInitialConfig> kv: characterDict) {
    auto entity = registry.create();
    auto char_initial_config = kv.second;
    registry.emplace<components::CKey>(entity, char_initial_config.speed);
    registry.emplace<models::Pt>(entity, char_initial_config.pos);
    registry.emplace<components::CSpeed>(entity,
                                               char_initial_config.speed);
    registry.emplace<components::COrientation>(entity, char_initial_config.orientation);
    registry.emplace<components::CCharacterState>(entity,
                                                 components::CCharacterState::IDLE);

//        .with(Move::new(game_map.clone()))
  }

}

