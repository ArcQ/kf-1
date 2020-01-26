#include <string>
#include <vector>

#include "./Pt.hpp"

namespace models {
using std::string;
using std::vector;

enum TerrainType {
  WALKABLE,
  OBSTACLE,
};

struct GameMap {
 private:
  int width;
  int height;
  vector<vector<int>> map;

 public:
  explicit GameMap(int width, int height, vector<vector<int>> map);

  TerrainType getTerrainByPt(const models::Pt &point);
  TerrainType getTerrainByMapCoord(int x, int y);
};
}  // namespace models
