module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "ApiUser",
    {
      name: DataTypes.STRING,
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      description: DataTypes.STRING,
      apiKey: DataTypes.STRING,
      returnApiKey: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "api_users",
    },
  );

  User.associate = db => {
    User.hasMany(db.Project);
  };
  return User;
};
