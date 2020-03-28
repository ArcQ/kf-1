//
// Created by Eddie Law on 2020-03-13.
//

#include "move_system.hpp"
#include "../components/c_basic.hpp"
#include "../components/c_movement.hpp"
#include "../components/c_character_state.hpp"

namespace systems {
extern entt::dispatcher global_event_queue;
using namespace components::basic;

MovementSystem::NextPosCommand MovementSystem::calculate_next_command(double dt,
                                                                      models::Pt cur_pos,
                                                                      double speed,
                                                                      components::CMovement c_move) {

  if (!c_move.is_stopped) {
    return NextPosCommand(true, models::Pt(cur_pos));
  }

  auto dist = speed * dt * 10.0;
  auto move_diff = models::Pt::zip_with(c_move.multipliers,
                                        c_move.normalized,
                                        [dist](double multipliers_prop,
                                               double normalized_prop,
                                               char _) {
                                          return multipliers_prop * normalized_prop * dist;
                                        });

  auto next_pt = models::Pt::add(move_diff, cur_pos);

  if (game_map.get_terrain_by_pt(next_pt) == models::TerrainType::OBSTACLE) {
    return NextPosCommand(false, models::Pt(cur_pos));
  } else if (c_move.check_if_past(next_pt)) {
    return NextPosCommand(true, models::Pt(c_move.destination));
  } else {
    return NextPosCommand(false, models::Pt(next_pt));
  };
}

void MovementSystem::update(double dt) {

//    entt::observer observer{registry, entt::collector.replace<CMovement>()};
  auto movement_group = registry.group<CPosition,
                                       components::CMovement,
                                       components::CCharacterState>(entt::get<CSpeed>);
  movement_group.each([dt, this](entt::entity entity,
                                 CPosition &c_position,
                                 components::CMovement &c_movement,
                                 components::CCharacterState &c_character_state,
                                 const CSpeed &speed) {

    auto next_pos_command = calculate_next_command(dt, c_position, speed, c_movement);

    if (next_pos_command.is_complete) {
      c_character_state = components::CCharacterState::IDLE;
    }

//        global_event_queue.enqueue(EvEntityMoved{entity,
//                                                 c_movement.current_direction,
//                                                 c_position.position});
  });
}

}  // namespace systems
