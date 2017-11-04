const stub = {
  wasItDone: true,
  get: jest.fn(),
};

module.exports = (baseUri, headers) => {
  stub.baseUri = baseUri;
  stub.headers = headers;
  return stub;
};
