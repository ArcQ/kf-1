#include "Game.h"
#include <emscripten/bind.h>
#include <stdio.h>
#include <array>
#include <iostream>

using namespace emscripten;
using ::GameEnvAdapter;

GameEnvAdapter::GameEnvAdapter(bool broadcastUnchanged,
                               std::vector<std::string> encoderKeys) {
  std::cout << encoderKeys.at(0) << std::endl;
};

void GameEnvAdapter::tick(double /*dt*/) { 
}

EMSCRIPTEN_BINDINGS(my_module) {
  emscripten::register_vector<std::string>("CoderKeyMapping");

  value_array<std::array<int, 2>>("array_int_2")
      .element(emscripten::index<0>())
      .element(emscripten::index<1>());

  class_<GameEnvAdapter>("GameEnvAdapter")
      .constructor<bool, std::vector<std::string>>()
      .function("tick", &GameEnvAdapter::tick);
};
