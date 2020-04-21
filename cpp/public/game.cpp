#include "game.hpp"

#include <emscripten.h>
#include <emscripten/bind.h>

#include <array>
#include <cstdio>
#include <iostream>

#include "./js_event_emitter.hpp"

using namespace emscripten;
using ::GameEnvAdapter;

EM_JS(void, _broadcast_to_js, (std::vector<double> message), {
  window.js_wasm_adapter.update(message);
});

GameEnvAdapter::GameEnvAdapter(
    bool broadcast_unchanged,
    std::vector<string> encoder_keys,
    JsConfig::Game game_config)
    : encoded_message_builder(encoder::EncodedMessageBuilder(encoder_keys)),
      game_controller(kf1::GameController(
          std::make_unique<kf1::JsEventEmitter>(broadcast_to_js, encoded_message_builder),
          models::GameMap(
              std::move(game_config.map.gameM),
              game_config.map.tileW,
              game_config.map.tileH),
          game_config.character_dict
          // character_dict
          )) {
  game_controller.tick(0.1);
  /* common::encoder::CoderKeyMapping coder_key_mapping{encoder_keys}; */
  /* std::cout << std::to_string(encoder_keys.at(0)) << std::endl; */
};

void GameEnvAdapter::broadcast_to_js(std::vector<double> message) {
  _broadcast_to_js(std::move(message));
}

void GameEnvAdapter::tick(double /*dt*/) {}

EMSCRIPTEN_BINDINGS(my_module) {
  emscripten::register_vector<double>("CoderKeyMapping");

  class_<GameEnvAdapter>("GameEnvAdapter")
      /* .constructor<std::vector<double>, std::map<std::string, kf1::CharacterInitialConfig>, >()
       */
      .constructor<bool, std::vector<string>, JsConfig::Game>()
      .function("tick", &GameEnvAdapter::tick);
};
