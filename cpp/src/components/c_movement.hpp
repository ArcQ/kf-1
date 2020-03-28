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
  CMovement() = default;

  models::Pt destination;
  models::Pt diff;
  models::Pt normalized;
  models::Pt multipliers;
  bool is_stopped;
  bool completed;
  void set_new_destination(
      double speed,
      models::Pt &pos,
      models::Pt destination);

  components::COrientation get_x_direction();
  void stop();
  bool check_if_past(models::Pt &next_pt);
};
}

#endif //KF_1_GAME_SRC_COMPONENTS_C_MOVEMENT_HPP_
