//
// Created by Eddie Law on 2020-03-02.
//

#include "broadcast_system.hpp"

#include "c_character_state.hpp"
#include "c_orientation.hpp"

namespace systems {

void BroadcastSystem::update(double dt) {
  position_obs.each([this](const auto entity) {
    const auto [c_key, c_position] =
        registry.template get<components::CKey, components::CPosition>(entity);

    encoded_message_builder.push("SET_SPRITE_POS");
    encoded_message_builder.push(c_key);
    encoded_message_builder.push(c_position);
    encoded_message_builder.build_sub_state();
  });

  position_obs.clear();

  character_state_obs.each([this](const auto entity) {
    const auto &character_state = registry.template get<components::CCharacterState>(entity);

    encoded_message_builder.push("SET_CHAR_STATE");
    encoded_message_builder.push("P1");
    encoded_message_builder.push(components::CCharacterStateMapper::to_string(character_state));
    encoded_message_builder.build_sub_state();
  });

  character_state_obs.clear();

  orientation_obs.each([this](const auto entity) {
    const auto &orientation = registry.get<components::COrientation>(entity);

    encoded_message_builder.push("CHANGE_ORIENTATION");
    encoded_message_builder.push("P1");
    encoded_message_builder.push(components::OrientationMapper::to_string(orientation));
    encoded_message_builder.build_sub_state();
  });

  orientation_obs.clear();

  auto encoded_message = encoded_message_builder.build();

  if (!encoded_message.empty()) {
    broadcast_to_js(encoded_message);
  }
}
}  // namespace systems
