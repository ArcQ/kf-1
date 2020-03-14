#ifndef COMMON_MODELS_PT
#define COMMON_MODELS_PT

#include <string>

namespace models {

struct Pt {
  double x;
  double y;
  static const char KEY_X = 'X';
  static const char KEY_Y = 'Y';

  Pt(double x, double y) : x(x), y(y){};
  Pt(Pt const &pt)  : x(pt.x), y(pt.y){};;

  double get_by_k(char k);

  static Pt createOrigin() { return Pt(0, 0); }

  static Pt map_with(Pt pt1, double handler(double one, char k));
  static Pt zip_with(Pt pt1, Pt pt2,
                     double handler(double one, double two, char k));
  static Pt add(Pt one, Pt two);
  static Pt subtract(Pt one, Pt two);
};

}  // namespace models

#endif
