#include "Game.h"
#include <emscripten/bind.h>
#include <stdio.h>
#include <array>
#include <iostream>

using namespace emscripten;
using ::GameEnvAdapter;

GameEnvAdapter::GameEnvAdapter(bool broadcastUnchanged,
                               std::array<int, 2> encoderKeys){};

void GameEnvAdapter::tick(double dt) { printf("test\n"); }

EMSCRIPTEN_BINDINGS(my_module) {
  value_array<std::array<int, 2>>("array_int_2")
      .element(index<0>())
      .element(index<1>());

  class_<GameEnvAdapter>("GameEnvAdapter")
      .constructor<bool, std::array<int, 2>>()
      .function("tick", &GameEnvAdapter::tick);
};
