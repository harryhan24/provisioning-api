declare var jest, describe, test, expect;

import { isValidShortCode } from "../validation";

jest.unmock("../validation");

describe("The validation -> shortcode function", () => {
  test("should handle null values", () => {
    expect(isValidShortCode(null)).toBe(false);
  });

  test("should handle an error value", () => {
    expect(isValidShortCode("abc")).toBe(false);
    expect(isValidShortCode("123DD#%!")).toBe(false);
    expect(isValidShortCode("AAA__AAA")).toBe(false);
  });

  test("should handle good values", () => {
    expect(isValidShortCode("abc123abc")).toBe(true);
    expect(isValidShortCode("ABABAB")).toBe(true);
    expect(isValidShortCode("ABABABABAB")).toBe(true);
  });
});
