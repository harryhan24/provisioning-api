import "jest";

import * as libLdap from "ldapjs";
import Ldap from "../ldap";
import logger from "../logger";

jest.unmock("../ldap");
jest.mock("ldapjs", () => {
  const client = {
    bind: jest.fn(),
    search: jest.fn(),
  };
  return {
    client,
    createClient: jest.fn(() => client),
  };
});
jest.mock("../logger");

describe("The Ldap -> constructor", () => {
  test("should be setup properly", () => {
    const l = new Ldap("www.google.com", "baseDn", "user", "password");
    expect(l.bound).toBe(false);
    expect(l.baseDn).toBe("baseDn");
    expect(l.user).toBe("user");
    expect(l.password).toBe("password");
  });
});

describe("The Ldap -> bind function", () => {
  test("should not attempt to bind if it is already bound", () => {
    const l = new Ldap();
    l.bound = true;
    l.bind();

    expect(libLdap.client.bind).toHaveBeenCalledTimes(0);
  });

  test("should bind using the class variables", () => {
    const l = new Ldap("www.google.com", "baseDn", "user", "password");
    libLdap.client.bind.mockImplementationOnce((user, password, callback) => {
      callback();
    });

    l.bind();

    expect(libLdap.client.bind).toHaveBeenCalled();
  });
});

describe("The Ldap -> search function", () => {
  test("should handle errors", () => {
    const l = new Ldap("www.google.com", "baseDn", "user", "password");
    l.bind = jest.fn();
    l.client = libLdap.client;
    libLdap.client.search.mockImplementationOnce((baseDn, options, callback) => {
      callback(new Error("some_error"), null);
    });

    expect(l.search("a")).rejects.toEqual(new Error("Search failed with message: some_error"));
  });

  test("should handle a late error", () => {
    const l = new Ldap("www.google.com", "baseDn", "user", "password");
    l.bind = jest.fn();
    l.client = libLdap.client;

    // Create an ldap response object.. it's obnoxious. Only answer  the error call.
    const res = {
      on: jest.fn((type, callback) => {
        if (type === "error") {
          callback("some_error");
        }
        return res;
      }),
    };

    libLdap.client.search.mockImplementationOnce((baseDn, options, callback) => {
      callback(null, res);
    });

    expect(l.search("a")).rejects.toEqual(new Error("Search error: some_error"));
  });

  test("should handle a successful search", () => {
    const l = new Ldap("www.google.com", "baseDn", "user", "password");
    l.client = {
      search: jest.fn(),
    };
    l.bind = jest.fn();

    // Create an ldap response object.. it's obnoxious.
    const resThird = {
      on: jest.fn((type, cb) => {
        cb();
      }),
    };
    const resSecond = {
      on: jest.fn(() => resThird),
    };
    const resFirst = {
      on: jest.fn((type, cb) => {
        cb({ object: { username: "bob" } });
        return resSecond;
      }),
    };

    l.client.search.mockImplementationOnce((baseDn, options, callback) => {
      callback(null, resFirst);
    });

    const result = l.search("A", ["username"]);
    expect(result).resolves.toEqual([{ username: "bob" }]);
  });
});

describe("The Ldap -> searchFirst function", () => {
  test("should catch errors and return null", () => {
    const l = new Ldap("www.google.com", "baseDn", "user", "password");
    l.search = jest.fn();
    l.search.mockImplementationOnce(() => {
      throw new Error("some_error");
    });

    const result = l.searchFirst("a", ["username"]);
    expect(result).resolves.toBe(null);
    expect(logger.log).toHaveBeenCalledWith("error", "[Ldap] Search failed with error: some_error");
  });

  test("should be able to deal with a bad result", () => {
    const l = new Ldap("www.google.com", "baseDn", "user", "password");
    l.search = jest.fn();
    l.search.mockReturnValueOnce("a");

    const result = l.searchFirst("a", ["username"]);
    expect(result).resolves.toBe(null);
  });

  test("should be able to deal with no result", () => {
    const l = new Ldap("www.google.com", "baseDn", "user", "password");
    l.search = jest.fn();
    l.search.mockReturnValueOnce([]);

    const result = l.searchFirst("a", ["username"]);
    expect(result).resolves.toBe(null);
  });

  test("should be able to deal with a good result", () => {
    const l = new Ldap("www.google.com", "baseDn", "user", "password");
    l.search = jest.fn();
    l.search.mockReturnValueOnce(["one", "two", "three"]);

    const result = l.searchFirst("a", ["username"]);
    expect(result).resolves.toBe("one");
  });
});

describe("The Ldap -> cleanLdapEntry function", () => {
  test("should format booleans", () => {
    expect(Ldap.cleanLdapEntry({ key: "true" })).toEqual({ key: true });
    expect(Ldap.cleanLdapEntry({ key: "false" })).toEqual({ key: false });
  });

  test("should format integers", () => {
    expect(Ldap.cleanLdapEntry({ key: "123" })).toEqual({ key: 123 });
  });

  test("should handle arrays", () => {
    expect(Ldap.cleanLdapEntry([{ key: "true" }, { key: "false" }])).toEqual([{ key: true }, { key: false }]);
  });
});
