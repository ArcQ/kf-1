//
// Created by Eddie Law on 2020-03-13.
//

#include "move_system.hpp"

#include "../../components/c_basic.hpp"
#include "../../components/c_character_state.hpp"
//
using components::CPosition;
using components::CSpeed;

namespace systems {

extern entt::dispatcher global_event_queue;

void MoveSystem::update(double dt) {
  registry.group<CPosition, components::CMovement, components::CCharacterState, CSpeed>().each(
      [dt, this](
          entt::entity entity,
          CPosition &c_position,
          components::CMovement &c_movement,
          components::CCharacterState &c_character_state,
          const CSpeed &speed) {
        auto is_complete = systems::MoveHandler::move(dt, speed, c_position, game_map, c_movement);

        if (is_complete) {
          c_character_state = components::CCharacterState::IDLE;
        }
      });
}

}  // namespace systems
