#ifndef ENCODER_CODER_KEY_MAPPING_HPP
#define ENCODER_CODER_KEY_MAPPING_HPP

#include <string>
using std::string;
using std::vector;

class CoderKeyMapping {
 public:
  string* keys;
  CoderKeyMapping(vector<string>);
};

#endif
