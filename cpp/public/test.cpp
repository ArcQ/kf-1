class Base {
 public:
  Base() {}
  virtual ~Base() {}
};

class Derived : public Base {
 private:
  int blah = 0;

 public:
  Derived() {}
  virtual ~Derived() {}
};

class Manager {
 public:
  Manager(Base* b) {}
  ~Manager() {}

 private:
  Manager() {}
};

int main() {
  Derived* d = new Derived;
  Manager* m = new Manager(d);
  Manager* t = d;
  return 0;
}
