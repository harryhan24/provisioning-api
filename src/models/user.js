module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: DataTypes.STRING,
    uuid: DataTypes.STRING,
    eduPersonPrincipalName: DataTypes.STRING,
    auEduPersonSharedToken: DataTypes.STRING,
    mail: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });
  return User;
};
