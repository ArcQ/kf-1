#include "common/models/Pt.hpp"
#include "gtest/gtest.h"

using common::models::Pt;

// TEST(SquareRootTest, PositiveNos) {
//   EXPECT_EQ(18.0, square‑root(324.0));
//   EXPECT_EQ(25.4, square‑root(645.16));
//   EXPECT_EQ(50.3321, square‑root(2533.310224));
// }
//
// TEST(SquareRootTest, ZeroAndNegativeNos) {
//   ASSERT_EQ(0.0, square‑root(0.0));
//   ASSERT_EQ(‑1, square‑root(‑22.0));
// }

TEST(PtTest, Ctor) {
  Pt testPt(1.1, 2.2);
  EXPECT_EQ(testPt.x, 1.1);
  EXPECT_EQ(testPt.y, 2.2);
}

TEST(PtTest, Origin) {
  Pt origin = Pt::createOrigin();
  EXPECT_EQ(origin.x, 0);
  EXPECT_EQ(origin.y, 0);
}

TEST(PtTest, GetKeyString) {
  Pt testPt(1.1, 2.2);
  EXPECT_EQ(testPt.getByK(Pt::KEY_X), 1.1);
  EXPECT_EQ(testPt.getByK(Pt::KEY_Y), 2.2);
}

TEST(PtTest, clone) {
  Pt testPt(1.1, 2.2);
  Pt testPtClone = Pt::clone(testPt);
  testPt.x = 3;
  EXPECT_EQ(testPt.x, 3);
  EXPECT_EQ(testPtClone.x, 1.1);
}

TEST(PtTest, mapWith) {
  Pt testPt(1.1, 2.2);
  const Pt mapped = Pt::mapWith(testPt, [](double one, char k) {
    if (k == Pt::KEY_X) {
      return one * 2;
    }
    return one;
  });
  EXPECT_EQ(mapped.x, mapped.y);
}

TEST(PtTest, zipWith) {
  Pt testPt(1.1, 3.3);
  Pt testPtTwo(3, 2);
  const Pt zipped =
      Pt::zipWith(testPt, testPtTwo, [](double one, double two, char k) {
        if (k == Pt::KEY_X) {
          return one * two;
        }
        return one;
      });
  EXPECT_DOUBLE_EQ(zipped.x, zipped.y);
}

TEST(PtTest, add) {
  Pt testPt(1.1, 2.2);
  Pt testPtTwo(2.2, 3.3);
  const Pt added = Pt::add(testPt, testPtTwo);
  EXPECT_DOUBLE_EQ(added.x, 3.3);
  EXPECT_DOUBLE_EQ(added.y, 5.5);
}
//
TEST(PtTest, subtract) {
  Pt testPt(3.2, 3.3);
  Pt testPtTwo(1.1, 2.1);
  const Pt subtracted = Pt::subtract(testPt, testPtTwo);
  EXPECT_DOUBLE_EQ(subtracted.x, 2.1);
  EXPECT_DOUBLE_EQ(subtracted.y, 1.2);
}
