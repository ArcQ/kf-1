//
// Created by Eddie Law on 2020-03-26.
//

#include "systems_controller.hpp"

#include "broadcast_system.hpp"

kf1::SystemsController::SystemsController(
    entt::registry& registry,
    std::function<void(std::vector<double>)>&& broadcast_to_js,
    common::encoder::EncodedMessageBuilder& encoded_message_builder,
    models::GameMap& game_map) {
  basic_systems.push_back(systems::MoveSystem(registry, std::move(game_map)));
  basic_systems.push_back(
      systems::BroadcastSystem(registry, encoded_message_builder, std::move(broadcast_to_js));
};

void kf1::SystemsController::update(float dt) {
  for (systems::System& system : basic_systems) {
    system.update(dt);
  }
}
