#ifndef MODELS_COMMON_PT
#define MODELS_COMMON_PT

#include <string>

namespace common::models::Pt {

struct Pt {
 public:
  double x;
  double y;

  Pt(double x, double y);

  // this could just be a function, but staying consinstent using static factory
  // for all creational methods
  static Pt createOrigin();

  double getKeyString(std::string k);
  Pt clone();
};

Pt map(Pt pt2, void handler(double one, double two, std::string k));
Pt zipWith(Pt pt2, void handler(double one, double two, std::string k));

}  // namespace common::models::Pt

#endif
