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
  vector<vector<int>> m_map;

 public:
  int width = 0;
  int height = 0;
  GameMap() = default;

  explicit GameMap(vector<vector<int>> _map) {
    m_map = std::move(_map);
    height = m_map.size();
    width = m_map.at(0).size();
  }

  models::TerrainType get_terrain_by_coord(int x, int y) {
    return models::TerrainType(m_map.at(y).at(x));
  }

  models::TerrainType get_terrain_by_pt(const models::Pt &point) {
    return models::TerrainType(m_map.at(point.y).at(point.x));
  }
};
}  // namespace models
