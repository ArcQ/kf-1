#include <string>

using std::string;

namespace components::CharState {
enum CharState {
  IDLE,
  MOVE,
  SPOT_ATTACK,
};

string getCharStateAsString();
}  // namespace components::CharState
