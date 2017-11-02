import Sequelize from "sequelize";

import User from "./user";
import config from "../../config";

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  config.database,
);

const db = {
  User: sequelize.import("User", User),
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
