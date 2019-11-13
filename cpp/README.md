Go to a directory that you would like to install emsdk.

1. install emsdk https://github.com/emscripten-core/emsdk

```
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
source ./emsdk_env.sh
# add this to the path
emsdk install latest-upstream
emsdk activate latest-upstream
```

2. install conan https://conan.io/

if you are in OSX, you may have to update your xcode developer tools to use the latest apple-clang and have this under ~/.conan/profiles/default

```
[settings]
os=Macos
os_build=Macos
arch=x86_64
arch_build=x86_64
compiler=apple-clang
compiler.version=11.0
compiler.libcxx=libstdc++
build_type=Release
[options]
[build_requires]
[env]
```

3. run

```
#emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake
CMAKE_TOOLCHAIN_FILE=${EMCMAKE_LOCATION}
mkdir build
cd build
emconfigure cmake ..
conan install .. --build
make
```
