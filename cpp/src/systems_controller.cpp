//
// Created by Eddie Law on 2020-03-26.
//

#include "systems_controller.hpp"

void SystemsController::update(float dt) {
  for (systems::System& system : basic_systems) {
    system.update(dt);
  }
}
