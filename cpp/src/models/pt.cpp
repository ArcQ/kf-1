#include "pt.hpp"

using models::Pt;

/**
 * @brief get x or y based on a string key of x or y
 *
 * @param k
 *
 * @return
 */
double Pt::get_by_k(char k) {
  if (k == Pt::KEY_X) {
    return x;
  }
  if (k == Pt::KEY_Y) {
    return y;
  }
  throw std::invalid_argument(
      "k parameter must be of value Pt::KEY_X or Pt::KEY_Y");
}

/**
 * @brief maps over x and y, runs the handler fn(x|y) on eacy x and y
 * returns a new pt
 *
 * @param pt1
 * @param double one
 */
Pt Pt::map_with(Pt pt1, double handler(double one, char k)) {
  return Pt(handler(pt1.x, Pt::KEY_X), handler(pt1.y, Pt::KEY_Y));
}

/**
 * @brief maps over x and y, runs the handler fn(pt1.[x|y] , pt2.[x|y]) on each
 * and returns a new pt
 *
 * @param pt1
 * @param pt2
 * @param double one, double two, std::string k
 */
Pt Pt::zip_with(Pt pt1, Pt pt2, double handler(double one, double two, char k)) {
  return Pt(handler(pt1.x, pt2.x, Pt::KEY_X), handler(pt1.y, pt2.y, Pt::KEY_Y));
}

/**
 * @brief add point with another point x+x y+y
 *
 * @param one
 * @param two
 *
 * @return
 */
Pt Pt::add(Pt pt1, Pt pt2) {
  return Pt::zip_with(
      pt1, pt2, [](double one, double two, char /*k*/) { return one + two; });
}

/**
 * @brief subtract point with another point x-x y-y
 *
 * @param one
 * @param two
 *
 * @return
 */
Pt Pt::subtract(Pt pt1, Pt pt2) {
  return Pt::zip_with(
      pt1, pt2,
      [](double one, double two, char /*k*/) -> double { return one - two; });
}
