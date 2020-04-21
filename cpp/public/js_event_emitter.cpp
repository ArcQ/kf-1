#include "js_event_emitter.hpp"

#include <functional>

#include "c_character_state.hpp"

void kf1::JsEventEmitter::updatePosition(int c_key, models::Pt c_position) {
  encoded_message_builder.push("SET_SPRITE_POS");
  encoded_message_builder.push(c_key);
  encoded_message_builder.push(c_position);
  encoded_message_builder.build_sub_state();
};

void kf1::JsEventEmitter::updateCharacterState(int c_key, std::string character_state) {
  encoded_message_builder.push("SET_CHAR_STATE");
  encoded_message_builder.push(c_key);
  encoded_message_builder.push(character_state);
  encoded_message_builder.build_sub_state();
};

void kf1::JsEventEmitter::updateOrientation(int c_key, std::string&& orientation) {
  encoded_message_builder.push("CHANGE_ORIENTATION");
  encoded_message_builder.push(c_key);
  encoded_message_builder.push(orientation);
  encoded_message_builder.build_sub_state();
};

void kf1::JsEventEmitter::emit() {
  auto encoded_message = encoded_message_builder.build();

  if (!encoded_message.empty()) {
    broadcast_to_js(encoded_message);
  }
}  // namespace kf1
