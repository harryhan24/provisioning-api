module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert("ApiUsers", [
      {
        name: "Test Client API",
        description: "An API used only for local development",
        apiKey: "abc",
        returnApiKey: "def",
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete("ApiUsers", null, {}),
};
