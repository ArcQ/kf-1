//
// Created by Eddie Law on 2020-03-14.
//

#include "c_orientation.hpp"

using std::string;

namespace components {

COrientation get_orientation_from_string(string char_state_string) {
  switch (charStateString) {
    case string("RIGHT"):return COrientation::RIGHT;
    case string("LEFT"):return COrientation::LEFT;
  }
};

string get_string_from_orientation(COrientation c_orientation) {
  switch (charState) {
    case COrientation ::RIGHT:return string("RIGHT");
    case COrientation ::LEFT:return string("LEFT");
  }
};

}
