#ifndef GAME
#define GAME

#include <string>
#include <vector>
#include "game/GameEnv.h"

using namespace game;

class GameEnvAdapter {
 public:
  GameEnvAdapter(bool broadcastUnchanged, std::vector<double> encoderKeys);
  GameEnv gameEnv;

  static void tick(double dt);
};

#endif
