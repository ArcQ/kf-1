#ifndef ENCODER_CODER_KEY_MAPPING_HPP
#define ENCODER_CODER_KEY_MAPPING_HPP

#include <string>
#include <vector>

using std::string;
using std::vector;

namespace common::encoder {
class CoderKeyMapping {
 private:
  vector<string> keys;

 public:
  CoderKeyMapping(vector<string> keys);
  int encode(string key);
  string decode(int num);
};
}  // namespace common::encoder

#endif
