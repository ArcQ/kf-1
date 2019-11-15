cmake_minimum_required(VERSION 3.15.5)
project(tests CXX)

add_executable(unittest tests.cpp)
# find_package(GTest REQUIRED)
target_link_libraries(unittest game-wasm Kf1Conan:gtest)
add_test(NAME unittest
  WORKING_DIRECTORY ${CMAKE_BINARY_DIR}/bin
  COMMAND unittest)

add_custom_target(check
  COMMAND env CTEST_OUTPUT_ON_FAILURE=1 GTEST_COLOR=1 ${CMAKE_CTEST_COMMAND}
  DEPENDS unittest)
