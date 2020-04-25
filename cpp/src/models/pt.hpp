#ifndef COMMON_MODELS_PT
#define COMMON_MODELS_PT

#include <string>
#include <functional>

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

  static bool is_equal(Pt &one, Pt &two) {
    return one.x == two.x && one.y == two.y;
  }

  static Pt map_with(
      const Pt &pt1,
      const std::function<double(double, double)>& handler);

  static Pt zip_with(
      const Pt &pt1,
      const Pt &pt2,
      const std::function<double(double, double, char)>& handler);

  static Pt add(Pt one, Pt two);
  static Pt subtract(Pt &one, Pt &two);

};

}  // namespace models

#endif
