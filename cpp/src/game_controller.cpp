#include "game_controller.hpp"  // header in local directory

#include <iostream>  // header in standard library
#include <utility>

#include "components/c_basic.hpp"
#include "components/c_character_state.hpp"
#include "components/c_orientation.hpp"
#include "factories/character_entity_factory.hpp"

kf1::GameController::GameController(
    JsEventEmitter jsEventEmitter, models::GameMap gameMap,
    std::map<std::string, CharacterInitialConfig> characterDict) {
  assign_entities(gameMap, characterDict);
}

void kf1::GameController::tick(double dt) {
  //  registry.view<components::basic::CPosition, components::>().each([dt](auto
  //  &pos, auto &vel) {
  //    pos.x += vel.dx * dt;
  //    pos.y += vel.dy * dt;
  //  });
}

void kf1::GameController::reset() {}

void kf1::GameController::assign_entities(
    models::GameMap map,
    std::map<std::string, CharacterInitialConfig> characterDict) {
  for (std::pair<std::string, CharacterInitialConfig> kv : characterDict) {
    auto char_initial_config = kv.second;
    auto entity = factories::CharacterEntityFactory::createBasic(
        registry, char_initial_config.orientation, char_initial_config.speed,
        char_initial_config.pos);
  }
}
