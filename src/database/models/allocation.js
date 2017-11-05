module.exports = (sequelize, DataTypes) => {
  const Allocation = sequelize.define(
    "Allocation",
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      status: DataTypes.INTEGER,
      provider: DataTypes.STRING,
      externalId: DataTypes.STRING,
      groupUuidRo: DataTypes.STRING,
      groupGidRo: DataTypes.INTEGER,
      groupUuidRw: DataTypes.STRING,
      groupGidRw: DataTypes.INTEGER,
      hasHumanData: DataTypes.BOOLEAN,
      hasHumanIdentifiableData: DataTypes.BOOLEAN,
      hasHpcRequirement: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "allocations",
    },
  );
  Allocation.associate = models => {
    Allocation.belongsTo(models.Project);
  };
  return Allocation;
};
