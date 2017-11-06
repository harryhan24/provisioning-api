export default {
  development: {
    username: "user",
    password: "password",
    database: "its",
    host: "dev-itsprov.uq.edu.au",
    port: 4002,
    dialect: "mysql",
  },
  test: {
    dialect: "sqlite",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
