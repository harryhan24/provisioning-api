module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert("users", [
      {
        name: "Jan-Willem Wisgerhof",
        eduPersonPrincipalName: "uqjwisge@uq.edu.au",
        auEduPersonSharedToken: "ajsbdjakdsada",
        mail: "uqjwisge@uq.edu.au",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete("users", null, {}),
};
