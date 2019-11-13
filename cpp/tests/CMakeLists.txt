cmake_minimum_version(VERSION 3.15.5)
project(tests CXX)

add_executable(unittest tests.cpp)
target_link_libraries(unittest example CONAN_PKG::gtest)
add_test(NAME unittest
         WORKING_DIRECTORY ${CMAKE_BINARY_DIR}/bin
         COMMAND unittest)
