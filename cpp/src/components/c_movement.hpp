//
// Created by Eddie Law on 2020-03-13.
//

#ifndef KF_1_GAME_SRC_COMPONENTS_C_MOVEMENT_HPP_
#define KF_1_GAME_SRC_COMPONENTS_C_MOVEMENT_HPP_

#include <pt.hpp>
#include <game_map.hpp>
#include "c_orientation.hpp"

namespace components {

struct CMovement {

  models::Pt destination;
  models::Pt diff;
  models::Pt normalized;
  models::Pt multipliers;
  bool is_stopped;
  bool completed;

  components::COrientation get_x_direction() const{
    return diff.x > 0 ? components::COrientation::RIGHT
                      : components::COrientation::LEFT;
  }

  void stop() {
    is_stopped = true;
  }
};
}

#endif //KF_1_GAME_SRC_COMPONENTS_C_MOVEMENT_HPP_
