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
