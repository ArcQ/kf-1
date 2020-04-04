//
// Created by Eddie Law on 2020-04-03.
//

#ifndef KF_1_GAME_SRC_FACTORIES_CHARACTER_ENTITY_FACTORY_HPP_
#define KF_1_GAME_SRC_FACTORIES_CHARACTER_ENTITY_FACTORY_HPP_

#include <entt/entt.hpp>
#include "../components/c_orientation.hpp"
#include "../models/pt.hpp"
namespace factories {

class CharacterEntityFactory {
 public:
  static entt::entity createBasic(entt::registry &registry,
                                  components::COrientation orientation,
                                  double speed,
                                  models::Pt pos);

  static entt::entity createBasic(entt::registry &registry, double speed);
};

}

#endif //KF_1_GAME_SRC_FACTORIES_CHARACTER_ENTITY_FACTORY_HPP_
