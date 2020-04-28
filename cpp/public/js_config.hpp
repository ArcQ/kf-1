#ifndef JS_CONFIG
#define JS_CONFIG

#include <map>
#include <vector>

#include "../src/game_controller.hpp"
namespace JsConfig {

struct GameMap {
  double tileW;
  double tileH;
  std::vector<std::vector<int>> matrix;
};

struct GameConfig {
  bool broadcast_unchanged = false;
  GameMap game_map;
  std::map<std::string, kf1::CharacterInitialConfig> character_dict;
};
}  // namespace JsConfig

#endif
