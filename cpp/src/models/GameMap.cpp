#include "./GameMap.hpp"

models::GameMap::GameMap(int width, int height, vector<vector<int>> _map)
    : width(width), height(height) {
  map = std::move(_map);
}

models::TerrainType models::GameMap::get_terrain_by_coord(int x, int y) {
  return models::TerrainType(map.at(y).at(x));
}

models::TerrainType models::GameMap::get_terrain_by_pt(const models::Pt &point) {
  return models::TerrainType(map.at(point.y).at(point.x));
}
