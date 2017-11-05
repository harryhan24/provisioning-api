module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert("Users", [
      {
        name: "Jan-Willem Wisgerhof",
        eduPersonPrincipalName: "uqjwisge@uq.edu.au",
        auEduPersonSharedToken: "ajsbdjakdsada",
        mail: "uqjwisge@uq.edu.au",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete("Users", null, {}),
};
