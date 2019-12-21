#ifndef ENCODER_ENCODED_MESSAGE_BUILDER_HPP
#define ENCODER_ENCODED_MESSAGE_BUILDER_HPP

#include <string>
#include <vector>
#include "./CoderKeyMapping.h"
#include "common/models/Pt.h"

using common::encoder::CoderKeyMapping;
using common::models::Pt;
using std::string;
using std::vector;

namespace common::encoder {
class EncodedMessageBuilder {
 public:
  CoderKeyMapping coderKeyMapping;
  vector<double> stateVec;
  vector<double> subStateVec;

  EncodedMessageBuilder(vector<string> keys);
  void reset();
  void push(string s);
  void push(int num);
  void push(double num);
  void push(Pt pt);
  void buildSubState();
  vector<double> build();
};
}  // namespace common::encoder

#endif
