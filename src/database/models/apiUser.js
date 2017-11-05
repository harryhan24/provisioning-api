module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("ApiUser", {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    apiKey: DataTypes.STRING,
    returnApiKey: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });

  User.associate = db => {
    User.hasMany(db.Project);
  };
  return User;
};
