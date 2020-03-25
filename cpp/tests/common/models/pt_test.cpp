#include <pt.hpp>

#include "gtest/gtest.h"

using models::Pt;

TEST(PtTest, DefaultCtor) {
  Pt test_pt = Pt();
  EXPECT_EQ(test_pt.x, 0);
  EXPECT_EQ(test_pt.y, 0);
}

TEST(PtTest, Ctor) {
  Pt test_pt(1.1, 2.2);
  EXPECT_EQ(test_pt.x, 1.1);
  EXPECT_EQ(test_pt.y, 2.2);
}

TEST(PtTest, Origin) {
  Pt origin = Pt::createOrigin();
  EXPECT_EQ(origin.x, 0);
  EXPECT_EQ(origin.y, 0);
}

TEST(PtTest, GetKeyString) {
  Pt test_pt(1.1, 2.2);
  EXPECT_EQ(test_pt.get_by_k(Pt::KEY_X), 1.1);
  EXPECT_EQ(test_pt.get_by_k(Pt::KEY_Y), 2.2);
}

TEST(PtTest, CopyConstructor) {
  Pt test_pt(1.1, 2.2);
  Pt test_ptClone = Pt(test_pt);
  test_pt.x = 3;
  EXPECT_EQ(test_pt.x, 3);
  EXPECT_EQ(test_ptClone.x, 1.1);
}

TEST(PtTest, map_with) {
  Pt test_pt(1.1, 2.2);
  const Pt mapped = Pt::map_with(test_pt, [](double one, char k) {
    if (k == Pt::KEY_X) {
      return one * 2;
    }
    return one;
  });
  EXPECT_EQ(mapped.x, mapped.y);
}

TEST(PtTest, zip_with) {
  Pt test_pt(1.1, 3.3);
  Pt test_pt_two(3, 2);
  const Pt zipped =
      Pt::zip_with(test_pt, test_pt_two, [](double one, double two, char k) {
        if (k == Pt::KEY_X) {
          return one * two;
        }
        return one;
      });
  EXPECT_DOUBLE_EQ(zipped.x, zipped.y);
}

TEST(PtTest, add) {
  Pt test_pt(1.1, 2.2);
  Pt test_pt_two(2.2, 3.3);
  const Pt added = Pt::add(test_pt, test_pt_two);
  EXPECT_DOUBLE_EQ(added.x, 3.3);
  EXPECT_DOUBLE_EQ(added.y, 5.5);
}
//
TEST(PtTest, subtract) {
  Pt test_pt(3.2, 3.3);
  Pt test_pt_two(1.1, 2.1);
  const Pt subtracted = Pt::subtract(test_pt, test_pt_two);
  EXPECT_DOUBLE_EQ(subtracted.x, 2.1);
  EXPECT_DOUBLE_EQ(subtracted.y, 1.2);
}

TEST(PtTest, is_equal) {
  Pt test_pt(1.1, 2.1);
  Pt test_pt_two(1.1, 2.1);
  Pt test_pt_three(2.1, 2.1);
  EXPECT_TRUE(Pt::is_equal(test_pt, test_pt_two));
  EXPECT_FALSE(Pt::is_equal(test_pt, test_pt_three));
}
