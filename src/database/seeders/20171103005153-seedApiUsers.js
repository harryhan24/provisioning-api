module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert("ApiUsers", [
      {
        id: 1,
        name: "Test Client API",
        description: "An API used only for local development",
        apiKey: "abc",
        returnApiKey: "def",
      },
      {
        id: 2,
        name: "Unused API",
        description: "Unused",
        apiKey: "ghi",
        returnApiKey: "jkl",
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete("ApiUsers", null, {}),
};
