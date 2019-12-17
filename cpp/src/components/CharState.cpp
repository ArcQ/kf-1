#include "CharState.h"

using std::string;
using namespace components::CharState;

// TODO use a macro to automate this
string getCharStateAsString(CharState charState) {
  switch (charState) {
    case CharState::IDLE:
      return "IDLE";
    case CharState::MOVE:
      return "MOVE";
    case CharState::SPOT_ATTACK:
      return "SPOT_ATTACK";
  }
};
