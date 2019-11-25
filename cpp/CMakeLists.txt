cmake_minimum_required(VERSION 3.1.2)

project(kf-1-game,
  DESCRIPTION "Game Logic of kf-1"
  LANGUAGES CXX)

set(CMAKE_VERBOSE_MAKEFILE on)
set(CONAN_DISABLE_CHECK_COMPILER on)
#for clangtidy
set(CMAKE_EXPORT_COMPILE_COMMANDS on)
set(CMAKE_INCLUDE_HEADERS_IN_COMPILE_COMMANDS on)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/build)
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR}/build)


get_filename_component(REPO_ROOT ../ ABSOLUTE)
set(WEB_BUILD_DIRECTORY ${REPO_ROOT}/js/public/test-wasm)

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
  )


################################
# Build Flags
################################

add_definitions("-std=c++17")
set(WASM_BUILD_FLAGS  "-Wall --std=c++17 --bind -s WASM=1 -o game-wasm.js -s DEMANGLE_SUPPORT=1 ")

if (CMAKE_BUILD_TYPE MATCHES Release)
  message("Release build")
  set(OPT_BUILD_FLAGS  " -O3")
else ()
  message("Development build")
  set(OPT_BUILD_FLAGS  " --source-map-base localhost:3000 -O0 -g4")
endif()

if (BUILD_TESTS)
  message("Test build")
  add_library(game-wasm ${ALL_SRC})
  enable_testing()
  add_subdirectory(tests)
else()
  message("Web build")
  message( "${WASM_BUILD_FLAGS}${OPT_BUILD_FLAGS}")
  add_executable(game-wasm ${ALL_SRC})
  # set_target_properties(game-wasm PROPERTIES LINK_FLAGS "${WASM_BUILD_FLAGS}${OPT_BUILD_FLAGS}")

  # SET(CMAKE_CXX_FLAGS "${WASM_BUILD_FLAGS}${OPT_BUILD_FLAGS}")
  set_target_properties(game-wasm PROPERTIES LINK_FLAGS "${WASM_BUILD_FLAGS}${OPT_BUILD_FLAGS}")

  ##################################
  # Copy Build Files Into Web Folder
  ##################################

  set(build_files game-wasm.js;game-wasm.wasm;game-wasm.wasm.map)

  foreach(build_file ${build_files})
    add_custom_command(
      TARGET game-wasm POST_BUILD
      COMMAND ${CMAKE_COMMAND} -E copy
      ${CMAKE_RUNTIME_OUTPUT_DIRECTORY}/${build_file}
      ${WEB_BUILD_DIRECTORY}/${build_file})
  endforeach(build_file)

  add_custom_command(
    TARGET game-wasm POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy
    ${CMAKE_CURRENT_SOURCE_DIR}/build/compile_commands.json
    ${CMAKE_CURRENT_SOURCE_DIR}/compile_commands.json)
endif()
