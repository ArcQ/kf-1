#ifndef ENCODER_ENCODED_MESSAGE_BUILDER_HPP
#define ENCODER_ENCODED_MESSAGE_BUILDER_HPP

#include <string>
#include <vector>
#include <pt.hpp>

#include "coder_key_mapping.hpp"

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
