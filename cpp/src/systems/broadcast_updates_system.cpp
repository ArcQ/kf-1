//
// Created by Eddie Law on 2020-04-02.
//

#include "broadcast_updates_system.hpp"

namespace systems {
extern entt::dispatcher global_event_queue;

void BroadcastSystem::update(double dt) {

  registry.group<CPosition,
                 components::CMovement,
                 components::CCharacterState>(entt::get<CSpeed>).each(
      [dt, this](entt::entity entity,
                 CPosition &c_position,
                 components::CMovement &c_movement,
                 components::CCharacterState &c_character_state,
                 const CSpeed &speed) {
        auto is_complete = systems::MoveHandler::move(dt, speed, c_position, game_map, c_movement);

        if (is_complete) {
          c_character_state = components::CCharacterState::IDLE;
        }

      });
// positions
  for (key, pos, _) in(&key_storage, &pos_storage, self.tracker_store.get("pos")).join()
  {
    self.js_event_emitter.encoded_message_builder.push_str("SET_SPRITE_POS");
    self.js_event_emitter.encoded_message_builder.push_i32(key
    .0);
    self.js_event_emitter.encoded_message_builder.push_pt(pos);
    self.js_event_emitter.encoded_message_builder.finalize_sub_state();
  }

  for (char_state, _) in(&char_state_storage, self.tracker_store.get("char_state")).join()
  {
    self.js_event_emitter.encoded_message_builder.push_str("SET_CHAR_STATE");
    self.js_event_emitter.encoded_message_builder.push_str("P1");
    self.js_event_emitter.encoded_message_builder.push_str(&char_state.get_state_as_string());
    self.js_event_emitter.encoded_message_builder.finalize_sub_state();
  }

  for (orientation, _) in(&orientation_storage, self.tracker_store.get("orientation")).join()
  {
    self.js_event_emitter.encoded_message_builder.push_str("CHANGE_ORIENTATION");
    self.js_event_emitter.encoded_message_builder.push_str("P1");
    self.js_event_emitter.encoded_message_builder.push(orientation
    .0);
    self.js_event_emitter.encoded_message_builder.finalize_sub_state();
  }

  self.js_event_emitter.broadcast_to_js();
  g_event_queue.enqueue(EvEntityMoved{entity, c_movement.current_direction,
                                      c_position.position});

  self.tracker_store.clear("char_state");
  self.tracker_store.clear("orientation");
  self.tracker_store.clear("pos");
}
}

