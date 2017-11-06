export const sp = {
  create_metadata: jest.fn(() => {
    "some_metadata!";
  }),
  post_assert: jest.fn((someIdp, options, callback) => {
    callback(null, {
      user: {
        attributes: {
          name: ["Bob"],
          eduPersonPrincipalName: ["bob@uq.edu.au"],
          auEduPersonSharedToken: ["bob-token-aaf"],
          mail: ["bob@uq.edu.au"],
        },
        name_id: "Bob",
        session_index: 123,
      },
    });
  }),
  create_logout_request_url: jest.fn((idp, data, callback) => {
    callback(null, "logout.sso.url");
  }),
};

export const idp = {};
