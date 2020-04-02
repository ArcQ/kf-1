//
// Created by Eddie Law on 2020-03-13.
//

#ifndef KF_1_GAME_SRC_SYSTEMS_MOVE_SYSTEM_HPP_
#define KF_1_GAME_SRC_SYSTEMS_MOVE_SYSTEM_HPP_

#include <pt.hpp>
#include "../system.hpp"
#include "../../components/c_movement.hpp"
#include "../../components/c_basic.hpp"
#include "move_handler.hpp"

namespace systems {


//extern entt::dispatcher global_event_queue;

/*!
 * \brief The MoveSystem takes care of handling movement updates for all entities that desire to move
 */
class MoveSystem : public System {
 private:
  models::GameMap game_map;

 public:
  MoveSystem(entt::registry &reg, models::GameMap game_map)
      : System(reg), game_map(std::move(game_map)) {};

  void update(double dt) override;
};

}  // namespace systems

#endif //KF_1_GAME_SRC_SYSTEMS_MOVE_SYSTEM_HPP_
