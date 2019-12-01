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

// string CoderKeyMapping::decode(int num) {
//   try {
//     return keys.at(num);
//   } catch (const std::out_of_range& ex) {
//     std::cout << "invalid value supplied to coderkeymapping" << ex.what()
//               << std::endl;
//   }
//   return "";
// }
