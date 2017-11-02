export const sp = {
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
};

export const idp = {};
