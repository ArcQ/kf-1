#ifndef GAME
#define GAME

#include <string>
#include <vector>
#include "game/game_controller.hpp"

using namespace game;

class GameEnvAdapter {
 public:
  GameEnvAdapter(bool broadcast_unchanged, std::vector<double> encoder_keys);
  GameEnv game_env;
  common::encoder::CoderKeyMapping encoder_keys_dict;

  static void tick(double dt);
};

#endif
