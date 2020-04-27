#include "game_controller.hpp"  // header in local directory

#include <iostream>  // header in standard library
#include <map>
#include <string>
#include <utility>

#include "components/c_basic.hpp"
#include "components/c_character_state.hpp"
#include "components/c_orientation.hpp"
#include "factories/character_entity_factory.hpp"

kf1::GameController::GameController(
    std::unique_ptr<kf1::EventEmitter>&& event_emitter,
    models::GameMap&& _game_map,
    const std::map<std::string, CharacterInitialConfig>& characterDict)
    : game_map(_game_map),
      systems_controller(kf1::SystemsController(registry, std::move(event_emitter), game_map)) {
  assign_entities(game_map, characterDict);
}

void kf1::GameController::tick(double dt) { systems_controller.update(dt); }

void kf1::GameController::reset() {}

void kf1::GameController::assign_entities(
    const models::GameMap& game_map,
    const std::map<std::string, CharacterInitialConfig>& character_dict) {
  for (const auto& kv : character_dict) {
    auto char_initial_config = kv.second;
    factories::CharacterEntityFactory::createBasic(
        registry,
        char_initial_config.orientation,
        char_initial_config.speed,
        char_initial_config.pos);
  }
}
