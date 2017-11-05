export default (req, res, next) => {
  res.locals.apiUser = {
    id: 1,
    name: "Test user",
  };
  next();
};
