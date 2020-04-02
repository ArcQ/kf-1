//
// Created by Eddie Law on 2020-03-13.
//

#include "../../components/c_basic.hpp"
#include "../../components/c_character_state.hpp"
#include "move_system.hpp"
//
using components::CPosition;
using components::CSpeed;

void systems::MoveSystem::update(double dt) {

//    entt::observer observer{registry, entt::collector.replace<CMovement>()};
  auto movement_group = registry.group<CPosition,
                                       components::CMovement,
                                       components::CCharacterState>(entt::get<CSpeed>);
  movement_group.each([dt, this](entt::entity entity,
                                 CPosition &c_position,
                                 components::CMovement &c_movement,
                                 components::CCharacterState &c_character_state,
                                 const CSpeed &speed) {

    auto is_complete = systems::MoveHandler::move(dt, speed, c_position, game_map, c_movement);

    if (is_complete) {
      c_character_state = components::CCharacterState::IDLE;
    }

//        global_event_queue.enqueue(EvEntityMoved{entity,
//                                                 c_movement.current_direction,
//                                                 c_position.position});
  });
}

