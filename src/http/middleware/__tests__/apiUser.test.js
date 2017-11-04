import apiUserMiddleware from "../apiUser";
import { ApiUser } from "../../../database/models";

jest.unmock("../apiUser");

class MockResponse {
  hasStatus;
  hasBody;
  locals = {};

  status(statusCode) {
    this.hasStatus = statusCode;
    return this;
  }

  json(data) {
    this.hasBody = data;
    return this;
  }

  send(data) {
    this.hasBody = data;
    return this;
  }
}

describe("The ApiUser middleware", () => {
  test("should be ignored when we request a /sp/* path", done => {
    const callback = jest.fn(() => {});
    apiUserMiddleware({ originalUrl: "/sp/login" }, {}, callback).then(() => {
      expect(callback).toHaveBeenCalled();
      done();
    });
  });

  test("should return an error if no authorization header is provided", done => {
    const callback = jest.fn(() => {});
    const mockResponse = new MockResponse();
    apiUserMiddleware(
      { originalUrl: "/", headers: {} },
      mockResponse,
      callback,
    ).then(() => {
      expect(callback).toHaveBeenCalledTimes(0);
      expect(mockResponse.hasStatus).toBe(403);
      expect(mockResponse.hasBody.status).toBe(403);
      expect(mockResponse.hasBody.message).toBe(
        "No authorization headers provided",
      );
      done();
    });
  });

  test("should return an error if no ApiKey is provided", done => {
    const callback = jest.fn(() => {});
    const mockResponse = new MockResponse();
    apiUserMiddleware(
      { originalUrl: "/", headers: { authorization: "" } },
      mockResponse,
      callback,
    ).then(() => {
      expect(callback).toHaveBeenCalledTimes(0);
      expect(mockResponse.hasStatus).toBe(403);
      expect(mockResponse.hasBody.status).toBe(403);
      expect(mockResponse.hasBody.message).toBe(
        "No authorization headers provided",
      );
      done();
    });
  });

  test("should return an error if an empty ApiKey is provided", done => {
    const callback = jest.fn(() => {});
    const mockResponse = new MockResponse();
    apiUserMiddleware(
      { originalUrl: "/", headers: { authorization: "ApiKey " } },
      mockResponse,
      callback,
    ).then(() => {
      expect(callback).toHaveBeenCalledTimes(0);
      expect(mockResponse.hasStatus).toBe(403);
      expect(mockResponse.hasBody.status).toBe(403);
      expect(mockResponse.hasBody.message).toBe("No api key was provided");
      done();
    });
  });

  test("should return an error if the ApiUser Sequelize instance throws an error", done => {
    const callback = jest.fn(() => {});
    const mockResponse = new MockResponse();

    jest.doMock("../../../database/models");
    ApiUser.findOne = jest.fn(() => {
      throw "error!";
    });

    apiUserMiddleware(
      { originalUrl: "/", headers: { authorization: "ApiKey abc" } },
      mockResponse,
      callback,
    ).then(() => {
      expect(callback).toHaveBeenCalledTimes(0);
      expect(mockResponse.hasStatus).toBe(400);
      expect(mockResponse.hasBody.status).toBe(400);
      expect(mockResponse.hasBody.e).toBe("error!");
      done();
    });
  });

  test("should return an error if no user could be found with the given api key", done => {
    const callback = jest.fn(() => {});
    const mockResponse = new MockResponse();

    jest.doMock("../../../database/models");
    ApiUser.findOne = jest.fn(() => null);

    apiUserMiddleware(
      { originalUrl: "/", headers: { authorization: "ApiKey abc" } },
      mockResponse,
      callback,
    ).then(() => {
      expect(callback).toHaveBeenCalledTimes(0);
      expect(mockResponse.hasStatus).toBe(403);
      expect(mockResponse.hasBody.message).toBe("Invalid api key");
      done();
    });
  });

  test("should set the apiUser in the Response locals on success", done => {
    const callback = jest.fn(() => {});
    const mockResponse = new MockResponse();

    jest.doMock("../../../database/models");
    ApiUser.findOne = jest.fn(() => "bob");

    apiUserMiddleware(
      { originalUrl: "/", headers: { authorization: "ApiKey abc" } },
      mockResponse,
      callback,
    ).then(() => {
      expect(callback).toHaveBeenCalled();
      expect(mockResponse.locals.apiUser).toBe("bob");
      done();
    });
  });
});

// apiUserMiddleware({ originalUrl: "/", headers: {authorization: 'ApiKey abc' }}, {}, callback).then(() => {
