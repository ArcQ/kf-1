//
// Created by Eddie Law on 2020-03-02.
//

#ifndef KF_1_GAME_SRC_UPDATE_BROADCASTER_HPP_
#define KF_1_GAME_SRC_UPDATE_BROADCASTER_HPP_

#include <entt/entt.hpp>

#include "../common/encoder/encoded_message_builder.hpp"
#include "../components/c_basic.hpp"
#include "../system.hpp"
#include "c_character_state.hpp"
#include "c_movement.hpp"

namespace systems {
class BroadcastSystem : public systems::System {
 private:
  entt::observer position_obs;
  entt::observer character_state_obs;
  entt::observer orientation_obs;
  common::encoder::EncodedMessageBuilder encoded_message_builder;
  std::function<void(std::vector<double>)>&& broadcast_to_js;

 public:
  explicit BroadcastSystem(
      entt::registry& registry,
      common::encoder::EncodedMessageBuilder& encoded_message_builder,
      std::function<void(std::vector<double>)>&& _broadcast_to_js)
      : System(registry),
        position_obs{registry, entt::collector.replace<components::CPosition>()},
        character_state_obs{registry, entt::collector.replace<components::CCharacterState>()},
        orientation_obs{registry, entt::collector.replace<components::COrientation>()},
        encoded_message_builder{std::move(encoded_message_builder)},
        broadcast_to_js(std::move(_broadcast_to_js)){};

  void update(double dt) override;
};
}  // namespace systems

#endif  // KF_1_GAME_SRC_UPDATE_BROADCASTER_HPP_
