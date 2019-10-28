//for use only in dev for debug
#include<iostream>
#include <emscripten/bind.h>

using namespace emscripten;

class Counter {
public:
  int counter;

  Counter(int init) :
    counter(init) {
  }

  void increase() {
    counter++;
  }

  int squareCounter() {
    return counter * counter;
  }
};

EMSCRIPTEN_BINDINGS(my_module) {
  class_<Counter>("Counter")
    .constructor<int>()
    .function("increase", &Counter::increase)
    .function("squareCounter", &Counter::squareCounter)
    .property("counter", &Counter::counter);
}
