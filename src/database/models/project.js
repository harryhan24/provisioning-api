module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      apiUserId: DataTypes.INTEGER,
      shortCode: DataTypes.STRING,
      hasHumanData: DataTypes.BOOLEAN,
      hasHumanIdentifiableData: DataTypes.BOOLEAN,
      hasHpcRequirement: DataTypes.BOOLEAN,
      notificationUrl: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "projects",
    },
  );
  Project.associate = models => {
    Project.belongsTo(models.ApiUser);
    Project.hasMany(models.Allocation);
  };
  return Project;
};
