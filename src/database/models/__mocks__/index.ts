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
  _single: () => Project,
  findOne: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  reload: jest.fn(),
};

export const Allocation = {
  create: jest.fn(),
};
