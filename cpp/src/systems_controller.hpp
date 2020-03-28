//
// Created by Eddie Law on 2020-03-26.
//

#ifndef KF_1_GAME_SRC_SYSTEMS_CONTROLLER_HPP_
#define KF_1_GAME_SRC_SYSTEMS_CONTROLLER_HPP_

#include <vector>
#include "systems/system.hpp"

class SystemsController {
 private:
  // systems that just need to be updated...in order
  std::vector<systems::System> basic_systems = {};

  void update(float dt);
};

#endif //KF_1_GAME_SRC_SYSTEMS_CONTROLLER_HPP_
