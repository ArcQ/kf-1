cmake_minimum_required(VERSION 3.15.5)
project(tests CXX)

set(PROJECT_TEST_DIR ${PROJECT_SOURCE_DIR}/tests)

file(GLOB_RECURSE ALL_TESTS
  ${PROJECT_TEST_DIR} "*.cpp"
  )

add_executable(unittest ${ALL_TESTS})
target_link_libraries(unittest game-wasm CONAN_PKG::gtest)
add_test(NAME unittest
  WORKING_DIRECTORY ${CMAKE_BINARY_DIR}/bin
  COMMAND unittest)

add_custom_target(check
  COMMAND env CTEST_OUTPUT_ON_FAILURE=2 GTEST_COLOR=1 ${CMAKE_CTEST_COMMAND}
  DEPENDS unittest)
