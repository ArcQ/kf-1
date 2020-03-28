#ifndef GAMEENV_HPP
#define GAMEENV_HPP

#include "common/encoder/coder_key_mapping.hpp"
#include "game_map.hpp"
#include <entt/entt.hpp>
#include <iostream>  // header in standard library

#include "js_event_emitter.hpp"
#include "components/c_orientation.hpp"
#include <map>

using std::string;
using std::map;

/* #include "../common/encoder/CoderKeyMapping.h"  // header in local directory
 */

/* using common::encoder::CoderKeyMapping; */

namespace kf1 {

struct CharacterInitialConfig {
  std::string k;
  components::COrientation orientation;
  double speed;
  models::Pt pos;
};

class GameController {
 public:
  GameController(JsEventEmitter jsEventEmitter,
                 models::GameMap gameMap,
                 map<std::string, CharacterInitialConfig> characterDict);
/* CoderKeyMapping encoderKeysDict; */
  void tick(double dt);
  void reset();

 private:
  entt::registry registry;
  void assign_entities(models::GameMap map, std::map<std::string, CharacterInitialConfig> char_dict);
};
}  // namespace game

#endif
