#include "Game.h"
#include <emscripten/bind.h>
#include <stdio.h>
#include <array>
#include <iostream>

using namespace emscripten;
using ::GameEnvAdapter;
using game::GameEnv;

GameEnvAdapter::GameEnvAdapter(bool broadcastUnchanged,
                               std::vector<double> encoderKeys) {
  gameEnv = GameEnv();
  gameEnv.tick(0.1);
  std::cout << std::to_string(encoderKeys.at(0)) << std::endl;
};

void GameEnvAdapter::tick(double /*dt*/) {}

EMSCRIPTEN_BINDINGS(my_module) {
  emscripten::register_vector<double>("CoderKeyMapping");

  class_<GameEnvAdapter>("GameEnvAdapter")
      .constructor<bool, std::vector<double>>()
      .function("tick", &GameEnvAdapter::tick);
};
