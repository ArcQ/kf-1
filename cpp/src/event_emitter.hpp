#ifndef EVENTEMITTER_HPP
#define EVENTEMITTER_HPP

#include "pt.hpp"

namespace kf1 {

class EventEmitter {
 public:
  EventEmitter() = default;
  EventEmitter(const EventEmitter&) = default;
  EventEmitter(EventEmitter&&) = default;
  EventEmitter& operator=(EventEmitter&&) = delete;
  EventEmitter& operator=(const EventEmitter&) = delete;

  virtual ~EventEmitter() noexcept = default;
  virtual void updatePosition(int c_key, models::Pt pt) = 0;
  virtual void updateCharacterState(int c_key, std::string character_state) = 0;
  virtual void updateOrientation(int c_key, std::string&& orientation) = 0;
  virtual void emit() = 0;
};
}  // namespace kf1
#endif
