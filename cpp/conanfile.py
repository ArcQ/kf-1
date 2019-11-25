from conans import ConanFile, CMake, tools


class Kf1Conan(ConanFile):
    name = "KF1"
    version = "0.1"
    settings = "os", "compiler", "build_type", "arch"
    options = {"build_tests": [True, False]}
    default_options = {"build_tests": False}
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
