//
// Created by Eddie Law on 2020-03-13.
//

#include "c_movement.hpp"
#include <cmath>

namespace components {

void CMovement::set_new_destination(double speed, models::Pt &pos,
                                    models::Pt _destination) {
  is_stopped = false;
  destination = _destination;
  diff = models::Pt::subtract(destination, pos);
  normalized = models::Pt(diff.x / abs(diff.x), diff.x / abs(diff.x));
  auto rad = atan(diff.y / diff.x);
  multipliers = models::Pt(cos(rad), sin(rad));
}

bool CMovement::check_if_past(models::Pt &next_pt) {
  auto changedSigns = [this, next_pt](char k) {
    return (signbit(destination.get_by_k(k) - next_pt.get_by_k(k))
        != (signbit(diff.get_by_k(k))));
  };

  return changedSigns(models::Pt::KEY_X) || changedSigns(models::Pt::KEY_Y);
}

components::COrientation CMovement::get_x_direction() {
  return diff.x > 0 ? components::COrientation::RIGHT
                    : components::COrientation::LEFT;
}

void CMovement::stop() {
  is_stopped = true;
}
}
