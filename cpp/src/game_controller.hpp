#ifndef GAMECONTROLLER_HPP
#define GAMECONTROLLER_HPP

#include <entt/entt.hpp>
#include <iostream>  // header in standard library
#include <map>

#include "components/c_orientation.hpp"
#include "systems_controller.hpp"

using std::map;
using std::string;

namespace kf1 {

struct CharacterInitialConfig {
  std::string k;
  std::string orientation;
  /* components::COrientation orientation; */
  double speed;
  models::Pt pos;
};

class GameController {
 private:
  entt::registry registry;
  models::GameMap game_map;
  kf1::SystemsController systems_controller;
  void assign_entities(
      const models::GameMap& game_map,
      const std::map<std::string, CharacterInitialConfig>& character_dict);

 public:
  GameController(
      std::unique_ptr<kf1::EventEmitter>&& event_emitter,
      models::GameMap&& _game_map,
      const std::map<std::string, CharacterInitialConfig>& characterDict);
  void tick(double dt);
  void reset();
};
}  // namespace kf1

#endif
