// DB
import { Sequelize } from "sequelize-typescript";
import config from "../config";

// Models
import { Allocation, ApiUser, Project, User } from "./models";

const sequelize = new Sequelize(config.database);
sequelize.addModels([Allocation, ApiUser, Project, User]);
