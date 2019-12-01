from conans import ConanFile, CMake, tools


class Kf1Conan(ConanFile):
    build_requires = "emsdk_installer/1.38.29@bincrafters/stable", "ninja_installer/1.8.2@bincrafters/stable"
    name = "KF1"
    version = "0.1"
    settings = {
            "os": ["Emscripten"],
            "arch": ["wasm"],
            "compiler": {"clang": {"version": ["6.0"], "libcxx": "libc++"}},
            }
    options = {"build_tests": [True, False]}
    default_options = {"build_tests": True}
    generators = "cmake"

    def requirements(self):
        if self.options.build_tests:
            self.requires("gtest/1.8.1@bincrafters/stable")


    def build(self):
        cmake = CMake(self)
        cmake.definitions["BUILD_TESTS"] = self.options.build_tests
        cmake.configure()
        cmake.build()
        if self.options.build_tests:
            cmake.test()

    def package(self):
        cmake = CMake(self)
        cmake.configure()
        cmake.install()

    def package_info(self):
        self.cpp_info.libs = tools.collect_libs(self)
