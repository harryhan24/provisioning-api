export const User = {
  findOrCreate: jest.fn(() => ({
    spread: callback => {
      callback({ username: "a", name: "b" });
    },
  })),
};

export const ApiUser = {
  findOrCreate: jest.fn(() => ({
    spread: callback => {
      callback({ username: "a", name: "b" });
    },
  })),
  findOne: jest.fn(),
};

export const Project = {
  findOne: jest.fn(),
  findAll: jest.fn(),
};
