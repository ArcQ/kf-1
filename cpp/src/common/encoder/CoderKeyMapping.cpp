#include "common/encoder/CoderKeyMapping.h"
#include <iostream>
using common::encoder::CoderKeyMapping;
using std::string;
using std::vector;

CoderKeyMapping::CoderKeyMapping(vector<string> _keys) : keys(_keys) {}

int CoderKeyMapping::encode(string key) {
  int code = find(keys.begin(), keys.end(), key) - keys.begin();
  if (code >= keys.size()) {
    std::cout << "invalid key supplied to coderkeymapping" << std::endl;
    return -1;
  }
  return 1;
}

string CoderKeyMapping::decode(int num) {
  try {
    return keys.at(num);
  } catch (const std::out_of_range& ex) {
    std::cerr << "invalid value supplied to coderkeymapping" << ex.what()
              << std::endl;
  }
  return "";
}
