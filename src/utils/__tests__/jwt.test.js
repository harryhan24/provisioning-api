import libJwt from "jsonwebtoken";
import jwt from "../jwt";
import config from "../../config";

jest.unmock("../jwt");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("JWT->sign", () => {
  test("should set the baseUri and headers on construct", () => {
    libJwt.sign.mockReturnValueOnce("some_return");
    const result = jwt.sign(
      { username: "a" },
      { name_id: "a", session_index: "b" },
    );

    expect(result).toBe("some_return");
    expect(libJwt.sign).toHaveBeenCalled();
  });
});

describe("JWT->verify", () => {
  test("should pass on the verify call to the jsonwebtoken library", () => {
    libJwt.verify.mockReturnValueOnce("some_return");
    const result = jwt.verify("abc");
    expect(result).toBe("some_return");
    expect(libJwt.verify).toHaveBeenCalledWith("abc", config.jwt.secret);
  });
});

describe("JWT->refresh", () => {
  test("should handle an error if the verify call fails", () => {
    libJwt.verify.mockImplementationOnce(() => {
      throw new Error("some_error");
    });
    expect(() => jwt.refresh("bob")).toThrow("some_error");
  });

  test("should verify and then sign a new token", () => {
    const oldToken = {
      user: { username: "bob" },
      session: { name_id: "a", session_index: "b" },
    };
    libJwt.verify.mockReturnValueOnce(oldToken);
    libJwt.sign.mockReturnValueOnce("new_token!");
    expect(jwt.refresh("a")).toBe("new_token!");
  });
});
