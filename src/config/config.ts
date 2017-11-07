export default {
  development: {
    defaultLoginRedirect: "http://dev-itsprov.uq.edu.au:4000/sp/reflector",
    defaultLogoutRedirect: "http://dev-itsprov.uq.edu.au:4000/sp/login",
    jwt: {
      secret: "shhhhhhh",
      cookieName: "DEV_ITSPROV_USER",
      domain: "dev-itsprov.uq.edu.au",
    },
    idpApi: {
      baseUri: "http://dev-itsprov.uq.edu.au:4004/idp/",
      authToken: "ABC",
    },
    log: {
      level: "silly",
      awsConfig: {
        accessKeyId: null,
        secretAccessKey: null,
        region: "ap-southeast-2",
      },
    },
    aws: {
      region: "ap-southeast-2",
      sqs: {
        endpoint: "http://localhost:4006",
        queueUrl: "http://localhost:4006/default",
      },
    },
  },
  test: {
    defaultLoginRedirect: "login.redirect.com",
    defaultLogoutRedirect: "logout.redirect.com",
    jwt: {
      secret: "test_secret",
      cookieName: "TEST_COOKIE_NAME",
      domain: "test-itsprov.uq.edu.au",
    },
    idpApi: {
      baseUri: "http://jsonapi:3000/idp/",
      authToken: "ABC",
    },
    log: {
      level: "silly",
      awsConfig: {
        accessKeyId: null,
        secretAccessKey: null,
        region: "ap-southeast-2",
      },
    },
    aws: {
      region: "ap-southeast-2",
      sqs: {
        endpoint: "http://localhost:4006",
        queueUrl: "http://localhost:4006/default",
      },
    },
  },
  production: {},
};
