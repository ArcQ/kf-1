#include "common/encoder/CoderKeyMapping.h"
#include "gtest/gtest.h"

using common::encoder::CoderKeyMapping;
using std::invalid_argument;

class CoderKeyMappingTest : public testing::Test {
 protected:
  CoderKeyMapping coderKeyMapping;
  CoderKeyMappingTest()
      : coderKeyMapping(
            CoderKeyMapping({"MOVE", "RUN", "JUMP", "ATTACK", "STOP"})) {}
};

TEST_F(CoderKeyMappingTest, decode) {
  EXPECT_EQ(coderKeyMapping.decode(0), "MOVE");
}

TEST_F(CoderKeyMappingTest, encode) {
   EXPECT_EQ(coderKeyMapping.encode("RUN"), 1);
}

TEST_F(CoderKeyMappingTest, notFound) {
  EXPECT_EQ(coderKeyMapping.decode(5), "");
  EXPECT_EQ(coderKeyMapping.encode("HIKE"), -1);
}
