jest.mock("./http/middleware/apiUserMiddleware");

// Utils
jest.mock("./utils/Fetch");
jest.mock("./utils/jwt");
jest.mock("./utils/ldap");
jest.mock("./utils/logger");
jest.mock("./utils/saml");
jest.mock("./utils/validation");

jest.mock("./database/models");

jest.mock("./database/init");

// Fetch mock
global.fetch = require("jest-fetch-mock"); // eslint-disable-line
