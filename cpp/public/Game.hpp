#ifndef GAME
#define GAME

#include <string>
#include <vector>

#include "../common/encoder/coder_key_mapping.hpp"
#include "../game_controller.hpp"

struct GameConfig {
 public:
  bool broadcast_unchanged;
  double tile_width;
  double tile_height;
};

class GameEnvAdapter {
 public:
  GameEnvAdapter(
      std::vector<string> encoder_keys,
      std::vector<std::vector<int>> game_map,
      std::map<std::string, kf1::CharacterInitialConfig> character_dict,
      std::function<void(std::vector<double>)> broadcast_to_js,
      GameConfig game_config);
  kf1::GameController game_controller;

  static void tick(double dt);

 private:
  void broadcast_to_js(std::vector<double> message);
  common::encoder::CoderKeyMapping coder_key_mapping;
};

#endif
