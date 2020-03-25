#include "gtest/gtest.h"
#include "../../../src/common/encoder/coder_key_mapping.hpp"

using common::encoder::CoderKeyMapping;

class CMoveTest : public testing::Test {
 public:
  CoderKeyMapping coder_key_mapping =
      CoderKeyMapping({"MOVE", "RUN", "JUMP", "ATTACK", "STOP"});
  CMoveTest() = default;
};

TEST_F(CMoveTest, decode) {
  EXPECT_EQ(coder_key_mapping.decode(0), "MOVE");
}

TEST_F(CMoveTest, encode) {
  EXPECT_EQ(coder_key_mapping.encode("RUN"), 1);
  EXPECT_EQ(coder_key_mapping.encode("ATTACK"), 3);
}

TEST_F(CMoveTest, notFound) {
  EXPECT_EQ(coder_key_mapping.decode(5), "");
  EXPECT_EQ(coder_key_mapping.encode("HIKE"), -1);
}
