#ifndef GAMEENVADAPTER_HPP
#define GAMEENVADAPTER_HPP

#include <iostream>  // header in standard library
/* #include "../common/encoder/CoderKeyMapping.h"  // header in local directory
 */

/* using common::encoder::CoderKeyMapping; */

namespace game {
class GameEnv {
 public:
  GameEnv();
  /* CoderKeyMapping encoderKeysDict; */

  void tick(double dt);
  void reset();
};
}  // namespace game

#endif
