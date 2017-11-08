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
  STATUS_INITIAL: 1,
  STATUS_PENDING_STORAGE: 2,
  STATUS_STORAGE_PROVIDED: 3,
  STATUS_PENDING_SHARED: 4,
  STATUS_ACTIVE: 0,
  create: jest.fn(),
  get: () => jest.fn(),
  findById: jest.fn(),
};
