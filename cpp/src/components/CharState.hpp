#include <string>

namespace components {
namespace CharState {
using std::string;
enum CharState {
  IDLE,
  MOVE,
  SPOT_ATTACK,
};

string getCharStateAsString();
}  // namespace CharState
}  // namespace components
