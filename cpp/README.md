Go to a directory that you would like to install emsdk.


```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
source ./emsdk_env.sh
# add this to the path
emsdk install latest-upstream
emsdk activate latest-upstream
make build-wasm
```
