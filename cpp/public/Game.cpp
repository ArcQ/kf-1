#include "Game.hpp"
#include <emscripten/bind.h>
#include <stdio.h>
#include <array>
#include <iostream>

using namespace emscripten;
using ::GameEnvAdapter;
using game::GameEnv;

GameEnvAdapter::GameEnvAdapter(bool broadcast_unchanged,
                               std::vector<double> encoder_keys) {
  game_env = GameEnv();
  game_env.tick(0.1);
  std::cout << std::to_string(encoder_keys.at(0)) << std::endl;
};

void GameEnvAdapter::tick(double /*dt*/) {}

EMSCRIPTEN_BINDINGS(my_module) {
  emscripten::register_vector<double>("CoderKeyMapping");

  class_<GameEnvAdapter>("GameEnvAdapter")
      .constructor<bool, std::vector<double>>()
      .function("tick", &GameEnvAdapter::tick);
};
