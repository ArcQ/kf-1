//
// Created by Eddie Law on 2020-04-03.
//

#include "character_entity_factory.hpp"

#include <pt.hpp>

#include "../components/c_basic.hpp"
#include "../components/c_character_state.hpp"

entt::entity factories::CharacterEntityFactory::createBasic(
    entt::registry &registry,
    components::COrientation orientation,
    double speed,
    const models::Pt &pos) {
  auto entity = registry.create();
  registry.emplace<components::CKey>(entity, speed);
  registry.emplace<models::Pt>(entity, pos);
  registry.emplace<components::CSpeed>(entity, speed);
  registry.emplace<components::COrientation>(entity, orientation);
  registry.emplace<components::CCharacterState>(entity, components::CCharacterState::IDLE);
  return entity;
}

// default creator, mostly for testing purposes
entt::entity factories::CharacterEntityFactory::createBasic(
    entt::registry &registry,
    double speed) {
  return factories::CharacterEntityFactory::createBasic(
      registry, components::COrientation::RIGHT, speed, models::Pt::createOrigin());
}
