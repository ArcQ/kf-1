#ifndef ENCODER_ENCODED_MESSAGE_BUILDER_HPP
#define ENCODER_ENCODED_MESSAGE_BUILDER_HPP

#include <string>
#include <vector>

#include "./CoderKeyMapping.hpp"
#include "models/Pt.hpp"

namespace common::encoder {
using common::encoder::CoderKeyMapping;
using models::Pt;
using std::string;
using std::vector;

class EncodedMessageBuilder {
  CoderKeyMapping coderKeyMapping;
  vector<double> stateVec;
  vector<double> subStateVec;

 public:
  explicit EncodedMessageBuilder(vector<string> keys);
  void reset();
  void push(string s);
  void push(int num);
  void push(double num);
  void push(Pt pt);
  void build_sub_state();
  vector<double> build();
};
}  // namespace common::encoder

#endif
