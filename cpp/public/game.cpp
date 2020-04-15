#include "game.hpp"

#include <emscripten/bind.h>
#include <stdio.h>

#include <array>
#include <iostream>

using namespace emscripten;
using ::GameEnvAdapter;

GameEnvAdapter::GameEnvAdapter(
    std::vector<string> encoder_keys,
    std::vector<std::vector<int>> game_map,
    std::map<std::string, kf1::CharacterInitialConfig> character_dict,
    std::function<void(std::vector<double>)> broadcast_to_js,
    GameConfig game_config) {
  game_controller = kf1::GameController(
      broadcast_to_js,
      models::GameMap(std::move(game_map), game_config.tile_width, game_config.tile_height),
      character_dict);

  game_controller.tick(0.1);
  common::encoder::CoderKeyMapping coder_key_mapping{encoder_keys};
  std::cout << std::to_string(encoder_keys.at(0)) << std::endl;
};

EM_JS(void, broadcast_to_js, (std::vector<double> message), {
  window.js_wasm_adapter.update(message);
});

void GameEnvAdapter::broadcast_to_js(std::vector<double> message) {
  broadcast_to_js(std::move(message));
}

void GameEnvAdapter::tick(double /*dt*/) {}

EMSCRIPTEN_BINDINGS(my_module) {
  emscripten::register_vector<double>("CoderKeyMapping");

  class_<GameEnvAdapter>("GameEnvAdapter")
      .constructor<std::vector<double>, std::map<std::string, kf1::CharacterInitialConfig>, >()
      .function("tick", &GameEnvAdapter::tick);
};
