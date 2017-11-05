module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("Projects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shortCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      apiUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      hasHumanData: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      hasHumanIdentifiableData: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      hasHpcRequirement: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      notificationUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable("Projects"),
};
