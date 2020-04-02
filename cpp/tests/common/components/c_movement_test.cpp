#include <gtest/gtest.h>
#include "../../../src/components/c_movement.hpp"
using components::CMovement;

class CMovementTest: public testing::Test {
 public:
  CMovementTest() = default;
};

TEST_F(CMovementTest, get_x_direction) {
  auto start = models::Pt::createOrigin();
  auto destination = models::Pt(11, 20);

  CMovement c_move = CMovement();
  c_move.diff = models::Pt(5,5);

  EXPECT_EQ(c_move.get_x_direction(), components::COrientation::RIGHT);

  c_move.diff = models::Pt(-5,5);

  EXPECT_EQ(c_move.get_x_direction(), components::COrientation::LEFT);
}

TEST_F(CMovementTest, stop) {
  CMovement c_move = CMovement();
  c_move.is_stopped = false;

  c_move.stop();
  EXPECT_TRUE(c_move.is_stopped);
}
