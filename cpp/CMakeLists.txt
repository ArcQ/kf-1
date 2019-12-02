cmake_minimum_required(VERSION 3.15.3)

# if( NOT CONAN_EXPORTED )
# 	execute_process(
# 		COMMAND conan install --build missing "${PROJECT_SOURCE_DIR}../"
# 		RESULT_VARIABLE CONAN_INSTALL_FAILED
# 	)
# 	if(CONAN_INSTALL_FAILED)
# 		message(FATAL_ERROR "conan install failed")
# 	endif()
# endif()



if (NOT BUILD_TESTS)
  # set(ENV{CC} "/usr/local/opt/llvm/bin/clang")
  # set(ENV{CXX} "/usr/local/opt/llvm/bin/clang++")
  # set(ENV{EMSDK} "/Users/eddielaw/.conan/data/emsdk_installer/1.38.29/bincrafters/stable/package/16edc5c715408e005b54d61db41959d8f63a70c2")
  # set(ENV{EMSCRIPTEN} "/Users/eddielaw/.conan/data/emsdk_installer/1.38.29/bincrafters/stable/package/16edc5c715408e005b54d61db41959d8f63a70c2/emscripten/1.38.29")
  # set(ENV{EM_CONFIG} "/Users/eddielaw/.conan/data/emsdk_installer/1.38.29/bincrafters/stable/package/16edc5c715408e005b54d61db41959d8f63a70c2/.emscripten")
  # set(ENV{EM_CACHE} "/Users/eddielaw/.conan/data/emsdk_installer/1.38.29/bincrafters/stable/package/16edc5c715408e005b54d61db41959d8f63a70c2/.emscripten_cache")
  # set(ENV{CONAN_CMAKE_TOOLCHAIN_FILE} "/Users/eddielaw/.conan/data/emsdk_installer/1.38.29/bincrafters/stable/package/16edc5c715408e005b54d61db41959d8f63a70c2/emscripten/1.38.29/cmake/Modules/Platform/Emscripten.cmake")
  # set(ENV{RANLIB} "/Users/eddielaw/.conan/data/emsdk_installer/1.38.29/bincrafters/stable/package/16edc5c715408e005b54d61db41959d8f63a70c2/emscripten/1.38.29/emranlib")
  # set(ENV{AR} "/Users/eddielaw/.conan/data/emsdk_installer/1.38.29/bincrafters/stable/package/16edc5c715408e005b54d61db41959d8f63a70c2/emscripten/1.38.29/emar")
  # set(ENV{PATH} "/Users/eddielaw/.conan/data/emsdk_installer/1.38.29/bincrafters/stable/package/16edc5c715408e005b54d61db41959d8f63a70c2:/Users/eddielaw/.conan/data/emsdk_installer/1.38.29/bincrafters/stable/package/16edc5c715408e005b54d61db41959d8f63a70c2/emscripten/1.38.29:/Users/eddielaw/.conan/data/ninja_installer/1.8.2/bincrafters/stable/package/743cf0321be3152777da4d05247a66d1552e70a2/bin:/Users/eddielaw/.conan/data/nodejs_installer/10.15.0/bincrafters/stable/package/743cf0321be3152777da4d05247a66d1552e70a2/bin:$ENV{PATH}")
  # set(CMAKE_TOOLCHAIN_FILE /Users/eddielaw/.conan/data/emsdk_installer/1.38.29/bincrafters/stable/package/16edc5c715408e005b54d61db41959d8f63a70c2/emscripten/1.38.29/cmake/Modules/Platform/Emscripten.cmake)
  # set(CONAN_IN_LOCAL_CACHE OFF)
  # set(CMAKE_EXPORT_NO_PACKAGE_REGISTRY ON)
endif()

# set(ENV{CMAKE_GENERATOR} "Ninja")

include( "${CMAKE_CURRENT_SOURCE_DIR}/toolchain.cmake" )

project(kf-1-game,
  DESCRIPTION "Game Logic of kf-1"
  LANGUAGES CXX)

set(CMAKE_VERBOSE_MAKEFILE on)
# set(CONAN_DISABLE_CHECK_COMPILER on)
#for clangtidy
set(CMAKE_EXPORT_COMPILE_COMMANDS on)
set(CMAKE_INCLUDE_HEADERS_IN_COMPILE_COMMANDS on)

get_filename_component(REPO_ROOT ../ ABSOLUTE)
set(WEB_BUILD_DIRECTORY ${REPO_ROOT}/js/public/test-wasm)

################################
# Source
################################

# include(${CMAKE_BINARY_DIR}/conanbuildinfo.cmake)
# conan_basic_setup(TARGETS)

include_directories(
  /emscripten/
  /Users/eddielaw/Development/scripts/emsdk/emscripten/incoming/system/include
  )
include_directories(
  ${PROJECT_SOURCE_DIR}/src
  ${PROJECT_SOURCE_DIR}/public
  )

file(GLOB_RECURSE ALL_SRC
  "${PROJECT_SOURCE_DIR}/src/*.cpp")

file(GLOB_RECURSE EMSCRIPTEN_API
  "${PROJECT_SOURCE_DIR}/public/*.cpp")


################################
# Build Flags
################################

add_definitions("-std=c++17")
set(WASM_BUILD_FLAGS  "-Wall --std=c++17 --bind -s WASM=1 -o game-wasm.js -s DEMANGLE_SUPPORT=1 -s DISABLE_EXCEPTION_CATCHING=0")
add_library(game-wasm-lib ${ALL_SRC})

if (CMAKE_BUILD_TYPE MATCHES Release)
  message("Release build")
  set(OPT_BUILD_FLAGS  " -O3")
else (CMAKE_BUILD_TYPE MATCHES Debug)
  message("Development build")
  set(OPT_BUILD_FLAGS  " --source-map-base localhost:3000 -O0 -g4")
endif()

if (BUILD_TESTS)
  message("Test build")
  add_subdirectory(tests)
else()
  message("Web build")
  message("${WASM_BUILD_FLAGS}${OPT_BUILD_FLAGS}")
  add_executable(game-wasm ${EMSCRIPTEN_API})
  target_link_libraries(game-wasm game-wasm-lib)
  # set_target_properties(game-wasm PROPERTIES LINK_FLAGS "${WASM_BUILD_FLAGS}${OPT_BUILD_FLAGS}")
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

  add_custom_command(
    TARGET game-wasm POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy
    ${CMAKE_CURRENT_SOURCE_DIR}/build/compile_commands.json
    ${CMAKE_CURRENT_SOURCE_DIR}/compile_commands.json)
endif()
