#include "CCharacterState.hpp"

using std::string;
using namespace components;

 string getStringFromCharState(CCharacterState charState) {
   switch (charState) {
     case CCharacterState::IDLE:
       return string("IDLE");
     case CCharacterState::MOVE:
       return string("MOVE");
     case CCharacterState::SPOT_ATTACK:
       return string("SPOT_ATTACK");
   }
 };

CCharacterState getCharStateFromString(string charStateString) {
  switch (charStateString) {
    case string("IDLE"):
      return CCharacterState::IDLE;
    case string("MOVE"):
      return CCharacterState::MOVE;
    case string("SPOT_ATTACK"):
      return CCharacterState::SPOT_ATTACK;
  }
};
