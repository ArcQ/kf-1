//
// Created by Eddie Law on 2020-03-29.
//

#include <game_map.hpp>
#include <pt.hpp>

#include "gtest/gtest.h"

TEST(GameMap, get_terrain_by_coord) {
  models::GameMap game_map = models::GameMap(
      {{0, 0, 0, 0}, {1, 1, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 0}}, 15, 15);
  EXPECT_EQ(game_map.get_terrain_by_coord(1, 1), 1);
  EXPECT_EQ(game_map.get_terrain_by_coord(2, 2), 0);
}

TEST(GameMap, get_terrain_by_pt) {
  models::GameMap game_map = models::GameMap(
      {{0, 0, 0, 0}, {1, 1, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 0}}, 15, 15);

  EXPECT_EQ(game_map.get_terrain_by_pt(models::Pt(13, 20)), 1);
  EXPECT_EQ(game_map.get_terrain_by_pt(models::Pt(40, 35)), 0);
}
