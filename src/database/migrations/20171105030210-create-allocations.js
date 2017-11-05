module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable("allocations", {
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
      projectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "projects", key: "id" },
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      provider: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      externalId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      groupUuidRo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      groupGidRo: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      groupUuidRw: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      groupGidRw: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable("allocations"),
};
