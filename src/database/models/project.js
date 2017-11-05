module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define("Project", {
    uuid: DataTypes.STRING,
    apiUserId: DataTypes.INTEGER,
    shortCode: DataTypes.STRING,
    hasHumanData: DataTypes.BOOLEAN,
    hasHumanIdentifiableData: DataTypes.BOOLEAN,
    hasHpcRequirement: DataTypes.BOOLEAN,
    notificationUrl: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
  Project.associate = models => {
    Project.belongsTo(models.ApiUser);
  };
  return Project;
};
