#include "../../../public/encoder/encoded_message_builder.hpp"

#include "gmock/gmock.h"
#include "gtest/gtest.h"

using encoder::EncodedMessageBuilder;

class EncodedMessageBuilderTest : public testing::Test {
 public:
  EncodedMessageBuilder encodedMessageBuilder =
      EncodedMessageBuilder({"MOVE", "RUN", "JUMP", "ATTACK", "STOP"});
  EncodedMessageBuilderTest() = default;
};

TEST_F(EncodedMessageBuilderTest, build) {
  encodedMessageBuilder.push(0);
  encodedMessageBuilder.push(1);
  encodedMessageBuilder.build_sub_state();
  ASSERT_THAT(encodedMessageBuilder.build(), testing::ElementsAre(4, 3, 0, 1));
}

TEST_F(EncodedMessageBuilderTest, pushPt) {
  encodedMessageBuilder.push(models::Pt(1, 2.1));
  encodedMessageBuilder.build_sub_state();
  ASSERT_THAT(encodedMessageBuilder.build(), testing::ElementsAre(4, 3, 1, 2.1));
}

TEST_F(EncodedMessageBuilderTest, pushStr) {
  encodedMessageBuilder.push(std::string("MOVE"));
  encodedMessageBuilder.push(std::string("STOP"));
  encodedMessageBuilder.build_sub_state();
  ASSERT_THAT(encodedMessageBuilder.build(), testing::ElementsAre(4, 3, 0, 4));
}

TEST_F(EncodedMessageBuilderTest, reset) {
  encodedMessageBuilder.push(models::Pt(1, 2.1));
  encodedMessageBuilder.build_sub_state();
  encodedMessageBuilder.reset();
  ASSERT_THAT(encodedMessageBuilder.build().size(), 0);
}
