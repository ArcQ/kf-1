#include "common/encoder/CoderKeyMapping.h"
#include "common/encoder/EncodedMessageBuilder.h"
#include "gtest/gtest.h"

using common::encoder::CoderKeyMapping;
using common::encoder::EncodedMessageBuilder;
using std::invalid_argument;

class EncodedMessageBuilderTest : public testing::Test {
 protected:
  EncodedMessageBuilder encodedMessageBuilder;
  EncodedMessageBuilderTest() {
    encodedMessageBuilder =
        EncodedMessageBuilder({"MOVE", "RUN", "JUMP", "ATTACK", "STOP"});
  }
};

TEST_F(CoderKeyMappingTest, decode) {
  EXPECT_EQ(coderKeyMapping.decode(0), "MOVE");
}
//
// TEST_F(CoderKeyMappingTest, encode) {
//   EXPECT_EQ(coderKeyMapping.encode("RUN"), 1);
// }
//
// TEST_F(CoderKeyMappingTest, notFound) {
//   EXPECT_EQ(coderKeyMapping.decode(5), "");
//   EXPECT_EQ(coderKeyMapping.encode("HIKE"), -1);
// }
