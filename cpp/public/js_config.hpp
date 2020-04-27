#ifndef JS_CONFIG
#define JS_CONFIG

#include <map>
#include <vector>

#include "../src/game_controller.hpp"
namespace JsConfig {

struct Map {
  double tileW;
  double tileH;
  std::vector<std::vector<int>> matrix;

 public:
  Map(double _tileW, double _tileH, std::vector<std::vector<int>> _matrix)
      : tileW(_tileW), tileH(_tileH), matrix(_matrix){};
};

struct Game {
 public:
  bool broadcast_unchanged = false;
  Map map;
  std::map<std::string, kf1::CharacterInitialConfig> character_dict;

  Game(
      bool _broadcast_unchanged,
      Map _map,
      std::map<std::string, kf1::CharacterInitialConfig> _character_dict)
      : broadcast_unchanged(_broadcast_unchanged), map(_map), character_dict(_character_dict){};
};
}  // namespace JsConfig

#endif
