#ifndef GAMEENV_HPP
#define GAMEENV_HPP

#include "common/encoder/CoderKeyMapping.hpp"
#include "models/GameMap.hpp"
#include <entt/entt.hpp>
#include <iostream>  // header in standard library

#include "JsEventEmitter.hpp"
#include <map>

using std::string;
using std::map;

/* #include "../common/encoder/CoderKeyMapping.h"  // header in local directory
 */

/* using common::encoder::CoderKeyMapping; */

namespace kf1 {

struct CharacterInitialConfig {
  std::string k;
  int encoded_k;
  double orientation;
  double speed;
  models::Pt pos;
};

class GameEnv {
 public:
  GameEnv(JsEventEmitter jsEventEmitter,
          models::GameMap gameMap,
          map<std::string, CharacterInitialConfig> characterDict);
/* CoderKeyMapping encoderKeysDict; */
  entt::registry registry;
  void tick(double dt);
  void reset();

 private:
  void assign_entities(models::GameMap map, std::map<std::string, CharacterInitialConfig> char_dict);
};
}  // namespace game

#endif
