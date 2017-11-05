module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert("Projects", [
      {
        id: 1,
        uuid: "ecf8c2db-ee7b-49b8-85a1-aceae3e93ded",
        shortCode: "AAAAAAAA",
        apiUserId: 1,
        notificationUrl: "http://jsonapi:3000/rdm/notify",
      },
      {
        id: 2,
        uuid: "7e759477-3f53-434a-ab5f-2bcec5e6fd20",
        shortCode: "AAAAAAAB",
        apiUserId: 1,
        notificationUrl: "http://jsonapi:3000/rdm/notify",
      },
      {
        id: 3,
        uuid: "d3590672-fdd8-4e82-92f7-82c49e33e336",
        shortCode: "AAAAAAAC",
        apiUserId: 1,
        notificationUrl: "http://jsonapi:3000/rdm/notify",
      },
      {
        id: 4,
        uuid: "aef4bea2-ddb4-4628-a0be-781a5e08f4fb",
        shortCode: "AAAAAAAD",
        apiUserId: 2,
        notificationUrl: "http://jsonapi:3000/rdm/notify",
      },
    ]),

  down: queryInterface => queryInterface.bulkDelete("Projects", null, {}),
};
