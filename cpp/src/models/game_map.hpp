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

  explicit GameMap(vector<vector<int>> map);

  TerrainType get_terrain_by_pt(const models::Pt &point);
  TerrainType get_terrain_by_coord(int x, int y);
};
}  // namespace models
