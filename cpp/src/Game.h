#ifndef GAME
#define GAME

#include <string>

class GameEnvAdapter {
 public:
  GameEnvAdapter(bool broadcastUnchanged, std::array<int, 2> encoderKeys);
  void tick(double dt);
};

#endif
