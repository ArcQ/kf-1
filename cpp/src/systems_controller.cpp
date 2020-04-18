//
// Created by Eddie Law on 2020-03-26.
//

#include "systems_controller.hpp"

#include "c_character_state.hpp"
#include "system.hpp"

kf1::SystemsController::SystemsController(
    entt::registry& _registry,
    kf1::EventEmitter&& event_emitter,
    models::GameMap& game_map)
    : registry(_registry),
      position_obs{_registry, entt::collector.replace<components::CPosition>()},
      character_state_obs{_registry, entt::collector.replace<components::CCharacterState>()},
      orientation_obs{_registry, entt::collector.replace<components::COrientation>()} {
  basic_systems.push_back(std::make_unique<systems::MoveSystem>(_registry, std::move(game_map)));
};

void kf1::SystemsController::update(double dt) {
  for (auto& system : basic_systems) {
    system->update(dt);
  }
  broadcast_changes(dt);
}

void kf1::SystemsController::broadcast_changes(double dt) {
  position_obs.each([this](const auto entity) {
    const auto [c_key, c_position] =
        registry.template get<components::CKey, components::CPosition>(entity);

    event_emitter.updatePosition(c_key, c_position);
  });

  position_obs.clear();

  character_state_obs.each([this](const auto entity) {
    const auto& [c_key, character_state] =
        registry.template get<components::CKey, components::CCharacterState>(entity);

    event_emitter.updateCharacterState(
        c_key, components::CCharacterStateMapper::to_string(character_state));
  });

  character_state_obs.clear();

  orientation_obs.each([this](const auto entity) {
    const auto& [c_key, orientation] =
        registry.get<components::CKey, components::COrientation>(entity);

    event_emitter.updateOrientation(c_key, components::OrientationMapper::to_string(orientation));
  });

  orientation_obs.clear();

  event_emitter.emit();
}
