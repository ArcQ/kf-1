//
// Created by Eddie Law on 2020-03-13.
//

#ifndef KF_1_GAME_SRC_SYSTEMS_MOVE_HANDLER_HPP_
#define KF_1_GAME_SRC_SYSTEMS_MOVE_HANDLER_HPP_

#include <pt.hpp>
#include <entt/entt.hpp>
#include "../../components/c_movement.hpp"

namespace systems {

struct MoveHandler {
 public:
  static components::CMovement create_movement_component(models::Pt &pos,
                                                   models::Pt _destination);

  static bool check_if_past(const components::CMovement &c_movement,
                            const models::Pt &next_pt);

  static bool move(double dt,
                   double speed,
                   models::Pt &cur_pos,
                   const models::GameMap &game_map,
                   const components::CMovement &c_move);
};
}  // namespace systems

#endif //KF_1_GAME_SRC_SYSTEMS_MOVE_HANDLER_HPP_
