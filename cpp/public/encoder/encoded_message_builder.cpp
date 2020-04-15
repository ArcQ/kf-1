#include "encoded_message_builder.hpp"

#include <iostream>
using common::encoder::EncodedMessageBuilder;
using std::string;
using std::vector;

EncodedMessageBuilder::EncodedMessageBuilder(vector<string> keys)
    : coderKeyMapping(CoderKeyMapping(std::move(keys))) {
  reset();
}

void EncodedMessageBuilder::reset() {
  stateVec.clear();
  subStateVec.clear();
}

void EncodedMessageBuilder::push(string s) {
  const int encoded = coderKeyMapping.encode(s);
  subStateVec.push_back(encoded);
}

void EncodedMessageBuilder::push(int i) { subStateVec.push_back((double)i); }

void EncodedMessageBuilder::push(double d) { subStateVec.push_back(d); }

void EncodedMessageBuilder::push(const Pt& pt) {
  subStateVec.push_back(pt.x);
  subStateVec.push_back(pt.y);
}

void EncodedMessageBuilder::build_sub_state() {
  int subStateVecLen = subStateVec.size();
  if (subStateVecLen > 0) {
    subStateVec.insert(subStateVec.begin(), subStateVecLen + 1);
    stateVec.insert(stateVec.end(), subStateVec.begin(), subStateVec.end());
    subStateVec.clear();
  }
}

vector<double> EncodedMessageBuilder::build() {
  int stateVecLen = stateVec.size();
  if (stateVecLen > 0) {
    stateVec.insert(stateVec.begin(), stateVecLen + 1);
    auto ret = vector<double>();
    std::swap(stateVec, ret);
    return ret;
  }
  return vector<double>();
}
