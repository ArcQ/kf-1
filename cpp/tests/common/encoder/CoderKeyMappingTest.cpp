#include <common/encoder/CoderKeyMapping.hpp>

#include "gtest/gtest.h"

using common::encoder::CoderKeyMapping;

class CoderKeyMappingTest : public testing::Test {
 public:
  CoderKeyMapping coderKeyMapping =
      CoderKeyMapping({"MOVE", "RUN", "JUMP", "ATTACK", "STOP"});
  CoderKeyMappingTest() = default;
};

TEST_F(CoderKeyMappingTest, decode) {
  EXPECT_EQ(coderKeyMapping.decode(0), "MOVE");
}

TEST_F(CoderKeyMappingTest, encode) {
  EXPECT_EQ(coderKeyMapping.encode("RUN"), 1);
  EXPECT_EQ(coderKeyMapping.encode("ATTACK"), 3);
}

TEST_F(CoderKeyMappingTest, notFound) {
  EXPECT_EQ(coderKeyMapping.decode(5), "");
  EXPECT_EQ(coderKeyMapping.encode("HIKE"), -1);
}
