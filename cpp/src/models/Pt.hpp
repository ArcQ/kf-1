#ifndef COMMON_MODELS_PT
#define COMMON_MODELS_PT

#include <string>

namespace models {

struct Pt {
 public:
  double x;
  double y;
  static const char KEY_X = 'X';
  static const char KEY_Y = 'Y';

  Pt(double _x, double _y);
  Pt(Pt const &pt);
  double get_by_k(char k);

  static Pt createOrigin();
  static Pt map_with(Pt pt1, double handler(double one, char k));
  static Pt zip_with(Pt pt1, Pt pt2,
                     double handler(double one, double two, char k));
  static Pt add(Pt one, Pt two);
  static Pt subtract(Pt one, Pt two);
};

}  // namespace models

#endif
