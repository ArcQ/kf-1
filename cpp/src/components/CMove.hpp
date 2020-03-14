//
// Created by Eddie Law on 2020-03-13.
//

#ifndef KF_1_GAME_SRC_COMPONENTS_CMOVE_HPP_
#define KF_1_GAME_SRC_COMPONENTS_CMOVE_HPP_

namespace components {
#include "models/Pt.hpp"

struct CMove {
  struct Properties {
    models::Pt diff;
    models::Pt normalized;
    models::Pt multipliers;
    models::Pt destination;
    &models::GameMap game_map,
  };

  models::Pt pt;
  Properties properties;
  bool is_stopped,
  bool completed;

  void calc_new_destination( &
  mut self, _speed: f32, pos: &Pt, destination: Pt
  );
};
}

#endif //KF_1_GAME_SRC_COMPONENTS_CMOVE_HPP_
