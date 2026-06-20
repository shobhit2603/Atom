import User from "../models/user.model.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserById = async (id, selectParams = "") => {
  let query = User.findById(id);
  if (selectParams) {
    query = query.select(selectParams);
  }
  return await query;
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const updateRefreshToken = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
  }
  return user;
};

export const clearRefreshToken = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
};
