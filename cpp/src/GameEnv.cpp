#include "GameEnv.hpp"  // header in local directory

#include <iostream>  // header in standard library

using game::GameEnv;

GameEnv::GameEnv(){};

void GameEnv::tick(double /*dt*/) { std::cout << "hi" << std::endl; };
