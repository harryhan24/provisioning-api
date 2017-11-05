import Sequelize from "sequelize";

import config from "../../config";

// Models
import ApiUser from "./apiUser";
import User from "./user";
import Project from "./project";

const sequelize = new Sequelize(
  config.database.database,
  config.database.username,
  config.database.password,
  config.database,
);

const db = {
  ApiUser: sequelize.import("ApiUser", ApiUser),
  User: sequelize.import("User", User),
  Project: sequelize.import("Project", Project),
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
