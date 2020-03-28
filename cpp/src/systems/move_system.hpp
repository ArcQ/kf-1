//
// Created by Eddie Law on 2020-03-13.
//

#ifndef KF_1_GAME_SRC_SYSTEMS_MOVE_SYSTEM_HPP_
#define KF_1_GAME_SRC_SYSTEMS_MOVE_SYSTEM_HPP_

#include <entt/entt.hpp>
#include <pt.hpp>
#include "system.hpp"
#include "../components/c_movement.hpp"

namespace systems
{
/*!
 * \brief The MovementSystem takes care of handling movement updates for all entities that desire to move
 */
class MovementSystem : public System {
 private:
  models::GameMap game_map;

  struct NextPosCommand {
    NextPosCommand(bool _is_complete, models::Pt _pt)
        : is_complete(_is_complete), pt(_pt) {};
    NextPosCommand() = default;
    bool is_complete = false;
    models::Pt pt;
  };

 public:
  MovementSystem(entt::registry &reg, models::GameMap game_map)
      : System(reg), game_map(game_map) {};

  void update(double dt) override;

  NextPosCommand calculate_next_command(double dt,
                                        models::Pt cur_pos,
                                        double speed,
                                        components::CMovement c_move);
};
}  // namespace systems

#endif //KF_1_GAME_SRC_SYSTEMS_MOVE_SYSTEM_HPP_
