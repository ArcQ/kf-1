//
// Created by Eddie Law on 2020-03-13.
//

#ifndef KF_1_GAME_SRC_COMPONENTS_C_CHARACTER_STATE_HPP_
#define KF_1_GAME_SRC_COMPONENTS_C_CHARACTER_STATE_HPP_

#include <string>
#include <map>

namespace components {
using std::string;
enum CCharacterState {
  IDLE,
  MOVE,
  SPOT_ATTACK,
};

struct CCharacterStateMapper {
 public:
  static const inline std::map<std::string, CCharacterState> string_map =
      {{"IDLE", CCharacterState::IDLE},
       {"MOVE", CCharacterState::MOVE},
       {"SPOT_ATTACK", CCharacterState::SPOT_ATTACK}};

  static CCharacterState from_string(const std::string charStateString) {
    return string_map.at(charStateString);
  }

  static std::string to_string(CCharacterState charState) {
    switch (charState) {
      case CCharacterState::IDLE:return string("IDLE");
      case CCharacterState::MOVE:return string("MOVE");
      case CCharacterState::SPOT_ATTACK:return string("SPOT_ATTACK");
    }
  };
};

}  // namespace components

#endif //KF_1_GAME_SRC_COMPONENTS_C_CHARACTER_STATE_HPP_
