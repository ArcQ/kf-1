#ifndef MODELS_COMMON_PT
#define MODELS_COMMON_PT

#include <string>

namespace common::models {

struct Pt {
 public:
  double x;
  double y;
  static const char KEY_X = 'X';
  static const char KEY_Y = 'Y';

  Pt(double _x, double _y);
  double getByK(char k) const;

  static Pt clone(Pt pt);
  static Pt createOrigin();
  static Pt mapWith(Pt pt1, double handler(double one, char k));
  static Pt zipWith(Pt pt1, Pt pt2,
                    double handler(double one, double two, char k));
  static Pt add(Pt one, Pt two);
  static Pt subtract(Pt one, Pt two);
};

};  // namespace common::models

#endif
