"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// DB
const sequelize_typescript_1 = require("sequelize-typescript");
const config_1 = require("../config");
// Models
const models_1 = require("./models");
const sequelize = new sequelize_typescript_1.Sequelize(config_1.default.database);
sequelize.addModels([models_1.Allocation, models_1.ApiUser, models_1.Project, models_1.User]);
//# sourceMappingURL=init.js.map