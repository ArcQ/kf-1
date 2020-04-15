//
// Created by Eddie Law on 2020-03-28.
//

#include "../../../../src/systems/move/move_system.hpp"

#include <gtest/gtest.h>

#include <entt/entt.hpp>
#include <pt.hpp>

#include "../../../../src/components/c_basic.hpp"
#include "../../../../src/components/c_character_state.hpp"
#include "../../../../src/components/c_movement.hpp"
#include "../../../../src/models/game_map.hpp"
#include "../../../../src/systems/move/move_handler.hpp"

using components::CMovement;

class MoveSystemTest : public testing::Test {
 public:
  MoveSystemTest() = default;
};

TEST_F(MoveSystemTest, update) {
  entt::registry registry;
  double dt = (1.0 / 60);
  models::GameMap game_map =
      models::GameMap({{0, 0, 0, 0}, {1, 1, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 0}}, 15, 15);

  auto move_system = systems::MoveSystem(registry, game_map);
  auto start = models::Pt::createOrigin();

  auto entity = registry.create();
  registry.emplace<components::CKey()>(entity, 1);
  registry.emplace<components::CPosition()>(entity, start);
  registry.emplace<components::CSpeed()>(entity, 50);
  registry.emplace<components::COrientation()>(entity, components::COrientation::RIGHT);
  registry.emplace<components::CCharacterState()>(entity, components::CCharacterState::IDLE);

  auto destination = models::Pt(11, 20);

  CMovement c_movement = systems::MoveHandler::create_movement_component(start, destination);

  registry.emplace_or_replace<components::CMovement>(entity, c_movement);

  move_system.update(dt);

  auto [cposition, cspeed] = registry.get<components::CPosition, components::CSpeed>(entity);

  EXPECT_DOUBLE_EQ(cposition.x, 4.0159895814346322);
  EXPECT_DOUBLE_EQ(cposition.y, 7.301799238972059);
}

TEST_F(MoveSystemTest, ObserverTest) {
  double dt = (1.0 / 60);

  entt::registry registry;
  entt::observer observer{registry, entt::collector.group<components::CMovement>()};

  ASSERT_EQ(observer.size(), 0u);
  ASSERT_TRUE(observer.empty());
  ASSERT_EQ(observer.data(), nullptr);
  ASSERT_EQ(observer.begin(), observer.end());

  models::GameMap game_map =
      models::GameMap({{0, 0, 0, 0}, {1, 1, 0, 0}, {0, 0, 0, 0}, {0, 0, 0, 0}}, 15, 15);

  auto move_system = systems::MoveSystem(registry, game_map);
  auto start = models::Pt::createOrigin();

  auto entity = registry.create();
  registry.emplace<components::CKey>(entity, 1);
  registry.emplace<components::CPosition>(entity, start);
  registry.emplace<components::CSpeed>(entity, 50);
  registry.emplace<components::COrientation>(entity, components::COrientation::RIGHT);
  registry.emplace<components::CCharacterState>(entity, components::CCharacterState::IDLE);

  auto destination = models::Pt(11, 20);

  CMovement c_movement = systems::MoveHandler::create_movement_component(start, destination);

  registry.emplace_or_replace<components::CMovement>(entity, c_movement);
  move_system.update(dt);

  auto [cposition, cspeed] = registry.get<components::CPosition, components::CSpeed>(entity);

  ASSERT_EQ(observer.size(), 1u);
  ASSERT_FALSE(observer.empty());
  ASSERT_NE(observer.data(), nullptr);
  ASSERT_EQ(*observer.data(), entity);
  ASSERT_NE(observer.begin(), observer.end());
  ASSERT_EQ(++observer.begin(), observer.end());
  ASSERT_EQ(*observer.begin(), entity);

  observer.clear();

  ASSERT_EQ(observer.size(), 0u);
  ASSERT_TRUE(observer.empty());
}
