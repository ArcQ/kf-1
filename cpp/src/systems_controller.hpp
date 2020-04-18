//
// Created by Eddie Law on 2020-03-26.
//

#ifndef KF_1_GAME_SRC_SYSTEMS_CONTROLLER_HPP_
#define KF_1_GAME_SRC_SYSTEMS_CONTROLLER_HPP_

#include <vector>

#include "encoder/encoded_message_builder.hpp"
#include "event_emitter.hpp"
#include "move_system.hpp"
#include "systems/system.hpp"

namespace kf1 {

class SystemsController {
 private:
  // systems that just need to be updated...in order
  std::vector<std::unique_ptr<systems::System>> basic_systems = {};
  kf1::EventEmitter event_emitter;
  entt::registry& registry;
  entt::observer position_obs;
  entt::observer character_state_obs;
  entt::observer orientation_obs;

  void broadcast_changes(double dt);

 public:
  SystemsController(
      entt::registry& registry,
      kf1::EventEmitter&& event_emitter,
      models::GameMap& game_map);

  static void createSystems();
  void update(double dt);
};
}  // namespace kf1

#endif  // KF_1_GAME_SRC_SYSTEMS_CONTROLLER_HPP_
