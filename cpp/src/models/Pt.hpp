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
  Pt() : x(0), y(0){};

  [[nodiscard]] double get_by_k(char k) const;

  static Pt createOrigin() { return Pt(0, 0); } ;

  template<typename Func>
  static Pt map_with(Pt &pt1, Func handler);

  template<typename Func>
  static Pt zip_with(Pt &pt1, Pt &pt2, Func handler);

  static Pt add(Pt one, Pt two);
  static Pt subtract(Pt &one, Pt &two);
};

}  // namespace models

#endif
