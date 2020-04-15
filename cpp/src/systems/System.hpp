//
// Created by Eddie Law on 2020-03-13.
//

#ifndef KF_1_GAME_SRC_SYSTEMS_SYSTEM_HPP_
#define KF_1_GAME_SRC_SYSTEMS_SYSTEM_HPP_

#include <entt/entt.hpp>

namespace systems {
class System {
 protected:
  entt::registry& registry;

 public:
  explicit System(entt::registry& reg) : registry(reg){};
  System(const System&) = default;
  System(System&&) = default;
  System& operator=(System&&) = delete;
  System& operator=(const System&) = delete;

  virtual ~System() noexcept = default;
  virtual void update(double dt) = 0;
};

}  // namespace systems
#endif  // KF_1_GAME_SRC_SYSTEMS_SYSTEM_HPP_
