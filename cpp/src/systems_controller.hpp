//
// Created by Eddie Law on 2020-03-26.
//

#ifndef KF_1_GAME_SRC_SYSTEMS_CONTROLLER_HPP_
#define KF_1_GAME_SRC_SYSTEMS_CONTROLLER_HPP_

#include <vector>

#include "encoder/encoded_message_builder.hpp"
#include "move_system.hpp"
#include "systems/system.hpp"

namespace kf1 {

class SystemsController {
 private:
  // systems that just need to be updated...in order
  std::vector<systems::System> basic_systems = {};

 public:
  SystemsController(
      entt::registry& registry,
      std::function<void(std::vector<double>)>&& broadcast_to_js,
      common::encoder::EncodedMessageBuilder& encoded_message_builder,
      models::GameMap& game_map);
};
}  // namespace kf1

#endif  // KF_1_GAME_SRC_SYSTEMS_CONTROLLER_HPP_
