#ifndef ENCODER_ENCODED_MESSAGE_BUILDER_HPP
#define ENCODER_ENCODED_MESSAGE_BUILDER_HPP

#include <pt.hpp>
#include <string>
#include <vector>

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
  void push(int i);
  void push(double d);
  void push(const Pt& pt);
  void build_sub_state();
  vector<double> build();
};
}  // namespace common::encoder

#endif
