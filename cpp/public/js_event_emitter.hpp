#ifndef JSEVENTEMITTER_HPP
#define JSEVENTEMITTER_HPP

#include <functional>

#include "../src/event_emitter.hpp"
#include "encoder/coder_key_mapping.hpp"
#include "encoder/encoded_message_builder.hpp"
namespace kf1 {

class JsEventEmitter : EventEmitter {
 private:
  const std::function<void(std::vector<double>)> broadcast_to_js;
  encoder::EncodedMessageBuilder encoded_message_builder;

 public:
  JsEventEmitter(
      std::function<void(std::vector<double>)>&& _broadcast_to_js,
      encoder::EncodedMessageBuilder& _encoded_message_builder)
      : broadcast_to_js(_broadcast_to_js), encoded_message_builder(_encoded_message_builder){};

  void updatePosition(int c_key, models::Pt c_position) override;
  void updateCharacterState(int c_key, std::string character_state) override;
  void updateOrientation(int c_key, std::string&& orientation) override;
  void emit() override;
};
};  // namespace kf1
#endif
