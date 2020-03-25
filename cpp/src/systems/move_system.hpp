//
// Created by Eddie Law on 2020-03-13.
//

#ifndef KF_1_GAME_SRC_SYSTEMS_MOVE_SYSTEM_HPP_
#define KF_1_GAME_SRC_SYSTEMS_MOVE_SYSTEM_HPP_

#include <entt/entt.hpp>
#include "system.hpp"

namespace systems
{
/*!
 * \brief The MovementSystem takes care of handling movement updates for all entities that desire to move
 */
class MovementSystem : public System
{
 public:
  MovementSystem(entt::registry& reg) : System(reg) {};

  void update(double dt);
};
}  // namespace systems

#endif //KF_1_GAME_SRC_SYSTEMS_MOVE_SYSTEM_HPP_
