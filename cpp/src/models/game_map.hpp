#include <math.h>

#include <string>
#include <vector>

#include "pt.hpp"

namespace models {
using std::string;
using std::vector;

enum TerrainType {
  WALKABLE,
  OBSTACLE,
};

struct GameMap {
 private:
  vector<vector<int>> map;
  double tile_width = 0;
  double tile_height = 0;

 public:
  GameMap() = default;

  explicit GameMap(vector<vector<int>> _map, double _tile_width, double _tile_height) {
    map = std::move(_map);
    tile_width = _tile_width;
    tile_height = _tile_height;
  }

  [[nodiscard]] models::TerrainType get_terrain_by_coord(int x, int y) const {
    return models::TerrainType(map.at(y).at(x));
  }

  [[nodiscard]] models::TerrainType get_terrain_by_pt(const models::Pt &point) const {
    return get_terrain_by_coord(floor(point.x / tile_width), floor(point.y / tile_height));
  }
};
}  // namespace models
