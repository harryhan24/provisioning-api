module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert("Users", [
      {
        name: "Jan-Willem Wisgerhof",
        uuid: "123-123-123-123-123",
        eduPersonPrincipalName: "uqjwisge@uq.edu.au",
        auEduPersonSharedToken: "ajsbdjakdsada",
        mail: "uqjwisge@uq.edu.au",
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete("User", null, {}),
};
