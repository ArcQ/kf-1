//
// Created by Eddie Law on 2020-03-14.
//

#ifndef KF_1_GAME_SRC_COMPONENTS_C_ORIENTATION_HPP_
#define KF_1_GAME_SRC_COMPONENTS_C_ORIENTATION_HPP_

#include <string>

namespace components {
using std::string;
enum COrientation {
  RIGHT,
  LEFT
};
COrientation get_orientation_from_string(string char_state_string);
string get_string_from_orientation(COrientation c_orientation);
}  // namespace components

#endif //KF_1_GAME_SRC_COMPONENTS_C_ORIENTATION_HPP_
