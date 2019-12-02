#ifndef GAME
#define GAME

#include <string>
#include <vector>

class GameEnvAdapter {
 public:
  GameEnvAdapter(bool broadcastUnchanged, std::vector<std::string> encoderKeys);
  static void tick(double dt);
};

#endif
