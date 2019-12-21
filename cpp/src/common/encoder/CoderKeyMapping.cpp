#include "./CoderKeyMapping.hpp"

#include <iostream>
using common::encoder::CoderKeyMapping;
using std::string;
using std::vector;

CoderKeyMapping::CoderKeyMapping(vector<string> _keys)
    : keys(std::move(_keys)) {}

int CoderKeyMapping::encode(string key) {
  int code = find(keys.begin(), keys.end(), key) - keys.begin();
  if (code >= keys.size()) {
    std::cout << std::string("invalid key supplied to coderkeymapping")
              << std::endl;
    return -1;
  }
  return code;
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
