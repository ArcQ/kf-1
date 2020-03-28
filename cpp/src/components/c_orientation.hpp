//
// Created by Eddie Law on 2020-03-14.
//

#ifndef KF_1_GAME_SRC_COMPONENTS_C_ORIENTATION_HPP_
#define KF_1_GAME_SRC_COMPONENTS_C_ORIENTATION_HPP_

#include <string>
#include <map>

namespace components {
using std::string;
enum COrientation {
  RIGHT,
  LEFT
};

struct OrientationMapper {
 public:
  static inline const std::map<std::string, COrientation> string_map =
      {{"RIGHT", COrientation::RIGHT},
       {"LEFT", COrientation::LEFT}};

  static COrientation from_string(string char_state_string) {
    return string_map.at(char_state_string);
  };

  static string to_string(COrientation c_orientation) {
    switch (c_orientation) {
      case COrientation ::RIGHT:return string("RIGHT");
      case COrientation ::LEFT:return string("LEFT");
    }
  };
};


}  // namespace components

#endif //KF_1_GAME_SRC_COMPONENTS_C_ORIENTATION_HPP_
