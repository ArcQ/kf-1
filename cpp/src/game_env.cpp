#include "game_env.hpp"  // header in local directory

#include <iostream>  // header in standard library
#include "components/c_basic.hpp"
#include "components/c_character_state.hpp"
#include <utility>

kf1::GameEnv::GameEnv(JsEventEmitter jsEventEmitter,
                      models::GameMap gameMap,
                      std::map<std::string,
                               CharacterInitialConfig> characterDict) {
  assign_entities(gameMap, characterDict);
}

void kf1::GameEnv::tick(double dt) {
//  registry.view<components::basic::CPosition, components::>().each([dt](auto &pos, auto &vel) {
//    pos.x += vel.dx * dt;
//    pos.y += vel.dy * dt;
//  });
}

void kf1::GameEnv::reset() {}

void kf1::GameEnv::assign_entities(models::GameMap map,
                                   std::map<std::string,
                                            CharacterInitialConfig> characterDict) {
  for (std::pair<std::string, CharacterInitialConfig> kv: characterDict) {
    auto entity = registry.create();
    auto char_initial_config = kv.second;
    registry.assign<components::basic::CKey>(entity, char_initial_config.speed);
    registry.assign<models::Pt>(entity, char_initial_config.pos);
    registry.assign<components::basic::CSpeed>(entity,
                                               char_initial_config.speed);
    registry.assign<components::basic::COrientation>(entity, char_initial_config.orientation);
    registry.assign<components::CCharacterState>(entity,
                                                 components::CCharacterState::IDLE);

//        .with(Move::new(game_map.clone()))
  }
//  registry.on_

}

