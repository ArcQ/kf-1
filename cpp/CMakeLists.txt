cmake_minimum_required(VERSION 2.8)
cmake_policy(SET CMP0015 NEW)

project(kf-1-game,
  DESCRIPTION "Game Logic of kf-1"
  LANGUAGES CXX)

set(CMAKE_VERBOSE_MAKEFILE on)
set(CMAKE_EXPORT_COMPILE_COMMANDS on)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/build)

INCLUDE_DIRECTORIES(include)

file(GLOB_RECURSE CORE_HDR src/*.h)
file(GLOB_RECURSE CORE_SRC src/*.cpp)

add_definitions("-std=c++14")
add_executable(game-wasm ${CORE_SRC} ${CORE_HDR})

if (CMAKE_BUILD_TYPE MATCHES Release)
  set_target_properties(game-wasm PROPERTIES LINK_FLAGS "--bind --std=c++14 -O3 -s WASM=1 -o ./build/test-wasm.js")
  message("Release build.")
else()
  set_target_properties(game-wasm PROPERTIES LINK_FLAGS "--bind --std=c++14 --source-map-base localhost:3000 -O0 -g4 -s WASM=1")
  message("Deveopment build")
endif()

get_filename_component(REPO_ROOT ../ ABSOLUTE)

set(build_files game.js;game.wasm;game.wasm.map)

foreach(build_file ${build_files})
  add_custom_command(
    TARGET game-wasm POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy
    ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/${build_file}
    ${REPO_ROOT}/js/public/test-wasm/${build_file})
endforeach(build_file)

add_custom_command(
  TARGET game-wasm POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E copy
  ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/compile_commands.json
  ${CMAKE_CURRENT_SOURCE_DIR}/compile_commands.json)
