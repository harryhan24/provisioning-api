jest.mock("./http/middleware/apiUser");

// Utils
jest.mock("./utils/Fetch");
jest.mock("./utils/jwt");
jest.mock("./utils/ldap");
jest.mock("./utils/logger");
jest.mock("./utils/saml");

jest.mock("./database/models");

// Fetch mock
global.fetch = require("jest-fetch-mock"); // eslint-disable-line
