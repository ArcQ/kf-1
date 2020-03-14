#ifndef ENCODER_CODER_KEY_MAPPING_HPP
#define ENCODER_CODER_KEY_MAPPING_HPP

#include <string>
#include <vector>

namespace common {
namespace encoder {
using std::string;
using std::vector;

class CoderKeyMapping {
 private:
  vector<string> keys;

 public:
  explicit CoderKeyMapping(vector<string> keys);
  int encode(string key);
  string decode(int num);
};
}  // namespace encoder
}  // namespace common

#endif
