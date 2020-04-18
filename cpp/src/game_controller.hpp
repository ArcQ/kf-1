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
  components::COrientation orientation;
  double speed;
  models::Pt pos;
};

class GameController {
 public:
  GameController(
      kf1::EventEmitter event_emitter,
      models::GameMap&& _game_map,
      const std::map<std::string, CharacterInitialConfig>& characterDict);
  void tick(double dt);
  void reset();

 private:
  models::GameMap game_map;
  kf1::SystemsController systems_controller;
  entt::registry registry;
  void assign_entities(
      const models::GameMap& game_map,
      const std::map<std::string, CharacterInitialConfig>& character_dict);
};
}  // namespace kf1

#endif
