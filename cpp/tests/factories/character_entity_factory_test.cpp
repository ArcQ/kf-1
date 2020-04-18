//
// Created by Eddie Law on 2020-04-03.
//

#include "../../../src/factories/character_entity_factory.hpp"

#include <entt/entt.hpp>

#include "../../../public/encoder/coder_key_mapping.hpp"
#include "../../../src/components/c_basic.hpp"
#include "gtest/gtest.h"

class CharEntityFactoryTest : public testing::Test {
 public:
  CharEntityFactoryTest() = default;
};

TEST_F(CharEntityFactoryTest, decode) {
  //  entt::entity basic_entity = factories::CharacterEntityFactory::createBasic();
}
