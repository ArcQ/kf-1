//
// Created by Eddie Law on 2020-03-13.
//

#include "move_handler.hpp"

components::CMovement systems::MoveHandler::create_movement_component(
    models::Pt &pos,
    const models::Pt &_destination) {
  auto c_movement = components::CMovement();
  c_movement.is_stopped = false;

  c_movement.destination = _destination;
  c_movement.diff = models::Pt::subtract(c_movement.destination, pos);
  c_movement.normalized = models::Pt(
      c_movement.diff.x / abs(c_movement.diff.x), c_movement.diff.x / abs(c_movement.diff.x));
  auto rad = atan(c_movement.diff.y / c_movement.diff.x);
  c_movement.multipliers = models::Pt(cos(rad), sin(rad));

  return c_movement;
}

bool systems::MoveHandler::check_if_past(
    const components::CMovement &c_movement,
    const models::Pt &next_pt) {
  auto changedSigns = [c_movement, next_pt](char k) {
    return (
        signbit(c_movement.destination.get_by_k(k) - next_pt.get_by_k(k)) !=
        (signbit(c_movement.diff.get_by_k(k))));
  };

  return changedSigns(models::Pt::KEY_X) || changedSigns(models::Pt::KEY_Y);
}
// returns whether move is complete
bool systems::MoveHandler::move(
    double dt,
    double speed,
    models::Pt &cur_pos,
    const models::GameMap &game_map,
    const components::CMovement &c_move) {
  if (c_move.is_stopped) {
    return true;
  }

  auto dist = speed * dt * 10.0;
  auto move_diff = models::Pt(
      c_move.multipliers.x * c_move.normalized.x * dist,
      c_move.multipliers.y * c_move.normalized.y * dist);

  auto next_pt = models::Pt::add(move_diff, cur_pos);

  if (game_map.get_terrain_by_pt(next_pt) == models::TerrainType::OBSTACLE) {
    return false;
  } else if (check_if_past(c_move, next_pt)) {
    cur_pos.x = c_move.destination.x;
    cur_pos.y = c_move.destination.y;
    return true;
  } else {
    cur_pos.x = next_pt.x;
    cur_pos.y = next_pt.y;
    return false;
  };
}
