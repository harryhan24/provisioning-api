const stub = {
  wasItDone: true,
  get: jest.fn(),
  baseUri: "",
  headers: "",
};

export default jest.fn((baseUri, headers) => {
  stub.baseUri = baseUri;
  stub.headers = headers;
  return stub;
});
