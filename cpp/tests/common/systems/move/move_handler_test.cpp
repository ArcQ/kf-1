//
// Created by Eddie Law on 2020-03-28.
//

#include <gtest/gtest.h>
#include <pt.hpp>
#include "../../../../src/components/c_movement.hpp"
#include "../../../../src/systems/move/move_handler.hpp"
using components::CMovement;

class MoveHandlerTest: public testing::Test {
 public:
  MoveHandlerTest() = default;
};

TEST_F(MoveHandlerTest, create_movement_component) {
  auto start = models::Pt::createOrigin();
  auto destination = models::Pt(11,
                                20);

  CMovement c_move = systems::MoveHandler::create_movement_component(start, destination);

  EXPECT_EQ(c_move.destination.x, destination.x);
  EXPECT_EQ(c_move.destination.y, destination.y);

  EXPECT_FALSE(c_move.is_stopped);

  EXPECT_DOUBLE_EQ(c_move.multipliers.x, 0.48191874977215582);
  EXPECT_DOUBLE_EQ(c_move.multipliers.y, 0.876215908676647);
}

TEST_F(MoveHandlerTest, move) {
  auto start = models::Pt::createOrigin();
  auto cur_pos = models::Pt(start);
  auto destination = models::Pt(11,
                                20);

  auto dt = 1/60.0;
  auto speed = 5.0;

  CMovement c_move = systems::MoveHandler::create_movement_component(start, destination);

  models::GameMap game_map = models::GameMap({
                                                 {0, 0, 0, 0},
                                                 {1, 1, 0, 0},
                                                 {0, 0, 0, 0},
                                                 {0, 0, 0, 0}}, 15, 15);

  auto is_complete = systems::MoveHandler::move(dt, speed, start, game_map, c_move);

  EXPECT_EQ(is_complete, false);
  EXPECT_EQ(c_move.destination.x, destination.x);
  EXPECT_EQ(c_move.destination.y, destination.y);
  EXPECT_FALSE(c_move.is_stopped);

  is_complete = systems::MoveHandler::move(dt, speed, start, game_map, c_move);

  EXPECT_DOUBLE_EQ(c_move.multipliers.x, 0.48191874977215582);
  EXPECT_DOUBLE_EQ(c_move.multipliers.y, 0.876215908676647);
  EXPECT_FALSE(is_complete );
}

TEST_F(MoveHandlerTest, move_with_obstacle) {
  auto start = models::Pt::createOrigin();
  auto cur_pos = models::Pt(start);
  auto destination = models::Pt(11,
                                20);

  auto dt = 1/60.0;
  auto speed = 5.0;
  bool is_complete = false;

  CMovement c_move = systems::MoveHandler::create_movement_component(start, destination);

  models::GameMap game_map = models::GameMap({
                                                 {0, 0, 0, 0},
                                                 {1, 1, 0, 0},
                                                 {0, 0, 0, 0},
                                                 {0, 0, 0, 0}}, 15, 15);

  for ( int i = 0; i < 120; i++ ) {
    is_complete = systems::MoveHandler::move(dt, speed, cur_pos, game_map, c_move);
  }

  EXPECT_DOUBLE_EQ(cur_pos.x, 8.0319791628692627);
  EXPECT_DOUBLE_EQ(cur_pos.y, 14.603598477944113);
  EXPECT_FALSE(is_complete);
}

TEST_F(MoveHandlerTest, check_if_past) {
  auto start = models::Pt::createOrigin();
  auto destination = models::Pt(11, 20);

  CMovement c_move = systems::MoveHandler::create_movement_component(start, destination);

  auto next = models::Pt(11, 21);
  auto next2 = models::Pt(11, 19);

  EXPECT_TRUE(systems::MoveHandler::check_if_past(c_move, next));
  EXPECT_FALSE(systems::MoveHandler::check_if_past(c_move, next2));
}

TEST_F(MoveHandlerTest, stop) {
  auto start = models::Pt::createOrigin();
  auto destination = models::Pt(11, 20);

  CMovement c_move = systems::MoveHandler::create_movement_component(start, destination);

  c_move.stop();
  EXPECT_TRUE(c_move.is_stopped);
}
