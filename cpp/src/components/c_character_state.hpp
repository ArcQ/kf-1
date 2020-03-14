//
// Created by Eddie Law on 2020-03-13.
//

#ifndef KF_1_GAME_SRC_COMPONENTS_C_CHARACTER_STATE_HPP_
#define KF_1_GAME_SRC_COMPONENTS_C_CHARACTER_STATE_HPP_

#include <string>

namespace components {
using std::string;
enum CCharacterState {
  IDLE,
  MOVE,
  SPOT_ATTACK,
};
CCharacterState get_char_state_from_string(string char_state_string);
string get_string_from_char_state(CCharacterState character_state);
}  // namespace components

#endif //KF_1_GAME_SRC_COMPONENTS_C_CHARACTER_STATE_HPP_
