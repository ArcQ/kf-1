//
// Created by Eddie Law on 2020-03-28.
//

#include <gtest/gtest.h>
#include <pt.hpp>
#include <entt/entt.hpp>
#include "../../../../src/components/c_movement.hpp"
#include "../../../../src/components/c_basic.hpp"
#include "../../../../src/components/c_character_state.hpp"
#include "../../../../src/systems/move/move_system.hpp"
#include "../../../../src/systems/move/move_handler.hpp"

using components::CMovement;

class MoveSystemTest : public testing::Test {
 public:
  MoveSystemTest() = default;
};

TEST_F(MoveSystemTest, update) {
  entt::registry registry;
  double dt = (1.0 / 60);
  models::GameMap game_map = models::GameMap({
                                                 {0, 0, 0, 0},
                                                 {1, 1, 0, 0},
                                                 {0, 0, 0, 0},
                                                 {0, 0, 0, 0}}, 15, 15);

  auto move_system = systems::MoveSystem(registry, game_map);
  auto start = models::Pt::createOrigin();

  auto entity = registry.create();
  registry.emplace<components::CKey>(entity, 1);
  registry.emplace<components::CPosition>(entity, start);
  registry.emplace<components::CSpeed>(entity, 50);
  registry.emplace<components::COrientation>(entity, components::COrientation::RIGHT);
  registry.emplace<components::CCharacterState>(entity,
                                                components::CCharacterState::IDLE);
//  .with(Move::new(game_map.clone()))

  auto destination = models::Pt(11,
                                20);

  CMovement c_movement = systems::MoveHandler::create_movement_component(
      start,
      destination);

  registry.emplace_or_replace<components::CMovement>(entity, c_movement);

  move_system.update(dt);

  auto[cposition, cspeed] = registry.get<components::CPosition, components::CSpeed>(entity);

  EXPECT_DOUBLE_EQ(cposition.x, 0.48191874977215582);
  EXPECT_DOUBLE_EQ(cposition.y, 0.876215908676647);
}

