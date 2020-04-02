cmake_minimum_required(VERSION 3.15.3)
project(tests CXX)

include(FetchContent)

FetchContent_Declare(
  googletest
  GIT_REPOSITORY https://github.com/google/googletest.git
  GIT_TAG        release-1.8.0
)

FetchContent_MakeAvailable(googletest)

# FetchContent_GetProperties(googletest)
#
# if(NOT googletest_POPULATED)
#   FetchContent_Populate(googletest)
#   set(gtest_disable_pthreads ON CACHE BOOL "" FORCE)
#   add_subdirectory(${googletest_SOURCE_DIR} ${googletest_BINARY_DIR})
# endif()

set(PROJECT_TEST_DIR ${PROJECT_SOURCE_DIR}/tests)

file(GLOB_RECURSE ALL_TESTS
    ${PROJECT_TEST_DIR} "*.cpp"
  )

add_executable(test-main ${ALL_TESTS} common/components/c_movement_test.cpp common/systems/move/move_handler_test.cpp common/models/game_map_test.cpp)
# target_link_libraries(unittests game-wasm-lib gtest gtest_main gmock gmock_main)
target_link_libraries(test-main gtest_main gmock_main game-wasm-lib)

add_test(NAME all_tests COMMAND test-main)

set_tests_properties(all_tests
  PROPERTIES
  ENVIRONMENT CTEST_OUTPUT_ON_FAILURE=2
  ENVIRONMENT GTEST_COLOR=1)

add_custom_target(check COMMAND ${CMAKE_CTEST_COMMAND}
  DEPENDS all_tests)

add_custom_command(
  TARGET test-main POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E copy
  ${PROJECT_SOURCE_DIR}/../build/compile_commands.json
  ${PROJECT_SOURCE_DIR}/../compile_commands.json)
