//
// Created by Eddie Law on 2020-03-13.
//

#include "CMove.hpp"

void CMove::calc_new_destination() &{
  this.is_stopped = false;
  this.destination = destination;
  this.diff = this.destination.sub(&pos);
  this.normalized = Pt::new(this.diff.x / this.diff.x.abs(), this.diff.x / this.diff.x.abs());
  auto rad = (this.diff.y / this.diff.x).atan();
  this.multipliers = Pt::new(rad.cos(), rad.sin());
}
