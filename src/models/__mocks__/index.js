export const User = {
  findOrCreate: jest.fn(() => ({
    spread: callback => {
      callback({ username: "a", name: "b" });
    },
  })),
};
