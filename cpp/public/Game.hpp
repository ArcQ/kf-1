#ifndef GAME
#define GAME

#include <string>
#include <vector>

#include "../game_controller.hpp"
#include "./js_config.hpp"

class GameEnvAdapter {
 private:
  std::unique_ptr<kf1::EventEmitter> event_emitter;
  encoder::EncodedMessageBuilder encoded_message_builder;
  static void broadcast_to_js(std::vector<double> message);

 public:
  GameEnvAdapter(
      bool broadcast_unchanged,
      std::vector<string> encoder_keys,
      JsConfig::Game game_config);
  kf1::GameController game_controller;

  static void tick(double dt);
};

#endif
