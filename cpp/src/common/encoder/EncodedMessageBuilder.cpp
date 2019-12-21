#include "EncodedMessageBuilder.h"
#include <iostream>
using common::encoder::EncodedMessageBuilder;
using std::string;
using std::vector;

EncodedMessageBuilder::EncodedMessageBuilder(vector<string> keys)
    : coderKeyMapping(CoderKeyMapping(keys)) {
  reset();
}

void EncodedMessageBuilder::reset() {
  stateVec = vector<double>();
  subStateVec = vector<double>();
}

void EncodedMessageBuilder::push(string s) {
  const int encoded = coderKeyMapping.encode(s);
  subStateVec.push_back(encoded);
}

