#include <string>

namespace components {
namespace CharState {
using std::string;
enum CharacterState {
  IDLE,
  MOVE,
  SPOT_ATTACK,
};

string getCharStateAsString();
}  // namespace CharacterState
}  // namespace components
