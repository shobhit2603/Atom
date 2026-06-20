import jwt from "jsonwebtoken";
import { config } from "../config/env.config.js";
import { ApiError } from "../utils/ApiError.js";
import {
  findUserByEmail,
  findUserById,
  createUser,
  updateRefreshToken,
  clearRefreshToken,
} from "../repositories/user.repository.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await findUserById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await updateRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

export const registerUserService = async (userData) => {
  const { firstName, lastName, email, password } = userData;

  if (
    [firstName, lastName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await findUserByEmail(email);

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const user = await createUser({
    firstName,
    lastName,
    email,
    password,
  });

  const createdUser = await findUserById(user._id, "-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return createdUser;
};

export const loginUserService = async (email, password) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await findUserById(user._id, "-password -refreshToken");

  return { loggedInUser, accessToken, refreshToken };
};

export const logoutUserService = async (userId) => {
  await clearRefreshToken(userId);
  return true;
};

export const refreshAccessTokenService = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      config.refreshTokenSecret
    );

    const user = await findUserById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
};
