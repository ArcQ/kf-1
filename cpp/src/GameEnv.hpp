#ifndef GAMEENV_HPP
#define GAMEENV_HPP

#include <common/encoder/CoderKeyMapping.hpp>
#include <entt/entt.hpp>
#include <iostream>  // header in standard library
#include <models/GameMap.hpp>

#include "JsEventEmitter.hpp"
#include <map>

using std::string;
using std::map;

/* #include "../common/encoder/CoderKeyMapping.h"  // header in local directory
 */

/* using common::encoder::CoderKeyMapping; */

namespace game {

struct CharInitialConfig {
  std::string k;
  int encoded_k;
  int speed;
  models::Pt pos;
};

class GameEnv {
 public:
  GameEnv(JsEventEmitter js_event_emitter, models::GameMap game_map,
          std::vector<CharInitialConfig> char_list);
  /* CoderKeyMapping encoderKeysDict; */
  common::encoder::CoderKeyMapping encoder_keys_dict;
  entt::registry registry;
  void tick(double dt);
  void reset();

 private:
  std::map<std::string, entity> create_entities(models::GameMap map,
                                     std::vector<CharInitialConfig> charDict);
};
}  // namespace game

#endif
