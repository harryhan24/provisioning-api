module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert("api_users", [
      {
        id: 1,
        name: "Test Client API",
        uuid: "abc",
        description: "An API used only for local development",
        apiKey: "abc",
        returnApiKey: "def",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Unused API",
        uuid: "def",
        description: "Unused",
        apiKey: "ghi",
        returnApiKey: "jkl",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete("api_users", null, {}),
};
