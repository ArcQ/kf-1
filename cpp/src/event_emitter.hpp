#ifndef EVENTEMITTER_HPP
#define EVENTEMITTER_HPP

#include "./system.hpp"
#include "pt.hpp"

namespace kf1 {

class EventEmitter {
 public:
  virtual void updatePosition(int c_key, models::Pt pt);
  virtual void updateCharacterState(int c_key, std::string character_state);
  virtual void updateOrientation(int c_key, std::string&& orientation);
  virtual void emit();
};
}  // namespace kf1
#endif
