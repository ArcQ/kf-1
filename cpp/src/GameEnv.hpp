#ifndef GAMEENV_HPP
#define GAMEENV_HPP

#include <common/encoder/CoderKeyMapping.hpp>
#include <iostream>  // header in standard library
/* #include "../common/encoder/CoderKeyMapping.h"  // header in local directory
 */

/* using common::encoder::CoderKeyMapping; */

namespace game {
class GameEnv {
 public:
  GameEnv(JsEventEmitter jsEventEmitter, GameMap gameMap,
          HashMap<String, char_dicts::CharInitialConfig> charDict);
  /* CoderKeyMapping encoderKeysDict; */
  common::encoder::CoderKeyMapping encoderKeysDict;
  void tick(double dt);
  void reset();

 private:
};
}  // namespace game

#endif
