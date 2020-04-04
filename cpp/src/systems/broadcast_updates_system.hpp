//
// Created by Eddie Law on 2020-04-02.
//

#ifndef KF_1_GAME_SRC_SYSTEMS_BROADCAST_UPDATES_SYSTEM_HPP_
#define KF_1_GAME_SRC_SYSTEMS_BROADCAST_UPDATES_SYSTEM_HPP_

#include "../system.hpp"

namespace systems {
/*!
 * \brief The MoveSystem takes care of handling movement updates for all entities that desire to move
 */
class BroadcastSystem : public System {
 private:
  models::GameMap game_map;

 public:
  BroadcastSystem(entt::registry &reg) : System(reg) {};

  void update(double dt) override;
};

}  // namespace systems

#endif //KF_1_GAME_SRC_SYSTEMS_BROADCAST_UPDATES_SYSTEM_HPP_
