const stub = {
  wasItDone: true,
  bind: jest.fn(),
  search: jest.fn(),
  searchFirst: jest.fn(),
};

module.exports = () => stub;
