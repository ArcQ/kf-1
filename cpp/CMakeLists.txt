cmake_minimum_required(VERSION 3.15.3)

include( "${CMAKE_CURRENT_SOURCE_DIR}/toolchain.cmake" )

project(kf-1-game,
  DESCRIPTION "Game Logic of kf-1"
  LANGUAGES CXX)

set(CMAKE_VERBOSE_MAKEFILE on)
set(CMAKE_EXPORT_COMPILE_COMMANDS on)
set(CMAKE_INCLUDE_HEADERS_IN_COMPILE_COMMANDS on)

get_filename_component(REPO_ROOT ../ ABSOLUTE)
set(WEB_BUILD_DIRECTORY ${REPO_ROOT}/js/public/test-wasm)

################################
# Source
################################

include_directories(
  /emscripten/
  /Users/eddielaw/Development/scripts/emsdk/emscripten/incoming/system/include
  )
include_directories(
  ${PROJECT_SOURCE_DIR}/include
  ${PROJECT_SOURCE_DIR}/src/models
  ${PROJECT_SOURCE_DIR}/public
  )

#file(GLOB_RECURSE ALL_SRC
#  "${PROJECT_SOURCE_DIR}/src/*.cpp")
#
#file(GLOB_RECURSE EMSCRIPTEN_API
#  "${PROJECT_SOURCE_DIR}/public/*.cpp")


################################
# Build Flags
################################

add_definitions("-std=c++17")
set(WASM_BUILD_FLAGS  "-Wall --std=c++17 --bind -s WASM=1 -o game-wasm.js -s DEMANGLE_SUPPORT=1 -s DISABLE_EXCEPTION_CATCHING=0")
add_library(game-wasm-lib
        src/game_controller.hpp src/game_controller.cpp
        src/models/pt.hpp src/models/pt.cpp
        src/models/game_map.hpp
        src/common/encoder/coder_key_mapping.hpp
        src/common/encoder/coder_key_mapping.cpp
        src/common/encoder/encoded_message_builder.hpp
        src/common/encoder/encoded_message_builder.cpp src/js_event_emitter.cpp src/js_event_emitter.hpp src/systems/move_system.cpp src/systems/move_system.hpp src/systems/System.hpp src/components/c_movement.cpp src/components/c_movement.hpp src/components/c_orientation.hpp src/systems_controller.cpp src/systems_controller.hpp)

if (CMAKE_BUILD_TYPE MATCHES Release)
  message("Release build")
  set(OPT_BUILD_FLAGS  " -O3")
else (CMAKE_BUILD_TYPE MATCHES Debug)
  message("Development build")
  set(OPT_BUILD_FLAGS  " --source-map-base localhost:3000 -O0 -g4")
endif()

if (BUILD_TESTS)
  message("Test build")
  enable_testing()
  add_subdirectory(tests)

else()
  message("Web build")
  message("${WASM_BUILD_FLAGS}${OPT_BUILD_FLAGS}")
  add_executable(game-wasm ${EMSCRIPTEN_API} public/game.hpp public/game.cpp)
  target_link_libraries(game-wasm game-wasm-lib)
  set(CMAKE_CXX_FLAGS "${WASM_BUILD_FLAGS}${OPT_BUILD_FLAGS}")

  ##################################
  # Copy Build Files Into Web Folder
  ##################################

  set(build_files game-wasm.js;game-wasm.wasm;game-wasm.wasm.map)

  foreach(build_file ${build_files})
    add_custom_command(
      TARGET game-wasm POST_BUILD
      COMMAND ${CMAKE_COMMAND} -E copy
      ${CMAKE_BINARY_DIR}/${build_file}
      ${WEB_BUILD_DIRECTORY}/${build_file})
  endforeach(build_file)

  # add_custom_command(
  #   TARGET game-wasm POST_BUILD
  #   COMMAND ${CMAKE_COMMAND} -E copy
  #   ${CMAKE_CURRENT_SOURCE_DIR}/build/compile_commands.json
  #   ${CMAKE_CURRENT_SOURCE_DIR}/compile_commands.json)
endif()
