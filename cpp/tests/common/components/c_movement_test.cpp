#include <gtest/gtest.h>
#include "../../../src/components/c_movement.hpp"
using components::CMovement;

class CoderKeyMappingTest: public testing::Test {
 public:
  CoderKeyMappingTest() = default;
};

TEST_F(CoderKeyMappingTest, set_new_destination) {
  auto start = models::Pt::createOrigin();
  auto destination = models::Pt(11,
      20);

  CMovement c_move = CMovement();
  c_move.set_new_destination(5, start, destination);

  EXPECT_EQ(c_move.destination.x, destination.x);
  EXPECT_EQ(c_move.destination.y, destination.y);

  EXPECT_FALSE(c_move.is_stopped);

  EXPECT_DOUBLE_EQ(c_move.multipliers.x, 0.48191874977215582);
  EXPECT_DOUBLE_EQ(c_move.multipliers.y, 0.876215908676647);
}

TEST_F(CoderKeyMappingTest, check_if_past) {
  auto start = models::Pt::createOrigin();
  auto destination = models::Pt(11, 20);

  CMovement c_move = CMovement();
  c_move.set_new_destination(5, start, destination);

  auto next = models::Pt(11, 21);
  auto next2 = models::Pt(11, 19);

  EXPECT_TRUE(c_move.check_if_past(next));
  EXPECT_FALSE(c_move.check_if_past(next2));
}

TEST_F(CoderKeyMappingTest, get_x_direction) {
  auto start = models::Pt::createOrigin();
  auto destination = models::Pt(11, 20);

  CMovement c_move = CMovement();
  c_move.set_new_destination(5, start, destination);

  EXPECT_EQ(c_move.get_x_direction(), components::COrientation::RIGHT);

  c_move.set_new_destination(5, destination, start);

  EXPECT_EQ(c_move.get_x_direction(), components::COrientation::LEFT);
}

TEST_F(CoderKeyMappingTest, stop) {
  auto start = models::Pt::createOrigin();
  auto destination = models::Pt(11, 20);

  CMovement c_move = CMovement();
  c_move.set_new_destination(5, start, destination);

  c_move.stop();
  EXPECT_TRUE(c_move.is_stopped);
}
