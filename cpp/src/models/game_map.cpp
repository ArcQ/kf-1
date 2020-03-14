#include "game_map.hpp"

models::GameMap::GameMap(vector<vector<int>> _map) {
  m_map = std::move(_map);
  height = m_map.size();
  width = m_map.at(0).size();
}

models::TerrainType models::GameMap::get_terrain_by_coord(int x, int y) {
  return models::TerrainType(m_map.at(y).at(x));
}

models::TerrainType models::GameMap::get_terrain_by_pt(const models::Pt &point) {
  return models::TerrainType(m_map.at(point.y).at(point.x));
}
