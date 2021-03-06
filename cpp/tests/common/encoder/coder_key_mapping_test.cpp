#include "../../../public/encoder/coder_key_mapping.hpp"

#include "gtest/gtest.h"

using encoder::CoderKeyMapping;

class CoderKeyMappingTest : public testing::Test {
 public:
  CoderKeyMapping coder_key_mapping = CoderKeyMapping({"MOVE", "RUN", "JUMP", "ATTACK", "STOP"});
  CoderKeyMappingTest() = default;
};

TEST_F(CoderKeyMappingTest, decode) { EXPECT_EQ(coder_key_mapping.decode(0), "MOVE"); }

TEST_F(CoderKeyMappingTest, encode) {
  EXPECT_EQ(coder_key_mapping.encode("RUN"), 1)
  EXPECT_EQ(coder_key_mapping.encode("ATTACK"), 3);
}

TEST_F(CoderKeyMappingTest, notFound) {
  EXPECT_EQ(coder_key_mapping.decode(5), "");
  EXPECT_EQ(coder_key_mapping.encode("HIKE"), -1);
}
