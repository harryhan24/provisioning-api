import Fetch from "../Fetch";

jest.unmock("../Fetch");

describe("Fetch", () => {
  test("should set the baseUri and headers on construct", () => {
    const f = new Fetch("www.google.com", { authorization: "ApiKey a" });
    expect(f.baseUri).toBe("www.google.com");
    expect(f.headers.authorization).toBe("ApiKey a");
  });

  test("should throw an error if the request fails", () => {
    fetch.mockRejectOnce();
    const f = new Fetch("a");
    expect(f.get("/token")).rejects.toBe(undefined);
  });

  test("should handle a successful request", () => {
    fetch.mockResponse(JSON.stringify({ question: "answer" }));
    const f = new Fetch("a");
    expect(f.get("/token")).resolves.toEqual({ question: "answer" });
  });
});
