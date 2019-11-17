cmake_minimum_required(VERSION 3.1.2)
# cmake_policy(SET CMP0015 NEW)

project(kf-1-game,
  DESCRIPTION "Game Logic of kf-1"
  LANGUAGES CXX)

set(CMAKE_VERBOSE_MAKEFILE on)
set(CONAN_DISABLE_CHECK_COMPILER on)
#for clangtidy
set(CMAKE_EXPORT_COMPILE_COMMANDS on)
set(CMAKE_INCLUDE_HEADERS_IN_COMPILE_COMMANDS on)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/build)

################################
# Source
################################

include(${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/conanbuildinfo.cmake)
conan_basic_setup(TARGETS)

INCLUDE_DIRECTORIES(
  ${PROJECT_SOURCE_DIR}/include
  ${PROJECT_SOURCE_DIR}/src
  )

file(GLOB_RECURSE ALL_SRC
  "${PROJECT_SOURCE_DIR}/include/*.h"
  "${PROJECT_SOURCE_DIR}/include/*.hpp"
  "${PROJECT_SOURCE_DIR}/src/*.cpp"
  "${PROJECT_SOURCE_DIR}/src/*.c"
  )


################################
# Build Flags
################################

add_definitions("-std=c++17")

  add_library(game-wasm ${ALL_SRC})

# if (BUILD_TESTS)
#   add_library(game-wasm ${ALL_SRC})
#   target_link_libraries(game-wasm foo)
# elseif (CMAKE_BUILD_TYPE MATCHES Release)
#   add_executable(game-wasm ${ALL_SRC})
#   set_target_properties(game-wasm PROPERTIES LINK_FLAGS "--bind --std=c++17 -O3 -s WASM=1 -o game-wasm.js")
#   message("Release build")
# else(BUILD_TEST)
#   add_executable(game-wasm ${ALL_SRC})
#   set_target_properties(game-wasm PROPERTIES LINK_FLAGS "--bind --std=c++17 --source-map-base localhost:3000 -O0 -g4 -s WASM=1 -o game-wasm.js")
#   message("Development build")
# endif()

##################################
# Copy Build Files Into Web Folder
##################################

# get_filename_component(REPO_ROOT ../ ABSOLUTE)

# set(build_files game-wasm.js;game-wasm.wasm;game-wasm.wasm.map)

# foreach(build_file ${build_files})
#   add_custom_command(
#     TARGET game-wasm POST_BUILD
#     COMMAND ${CMAKE_COMMAND} -E copy
#     ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/${build_file}
#     ${REPO_ROOT}/js/public/test-wasm/${build_file})
# endforeach(build_file)

# add_custom_command(
#   TARGET game-wasm POST_BUILD
#   COMMAND ${CMAKE_COMMAND} -E copy
#   ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/compile_commands.json
#   ${CMAKE_CURRENT_SOURCE_DIR}/compile_commands.json)

if(BUILD_TESTS)
  enable_testing()
  add_subdirectory(tests)
else(BUILD_TESTS)

endif()
