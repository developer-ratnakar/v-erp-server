import { LoginRequestDTO } from "../dto/login-request.dto.js";
import { LoginResponseDTO } from "../dto/login-response.dto.js";
import { CreateUserDTO } from "../dto/create-user.dto.js";
import authService from "../services/auth.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const login = async (req, res, next) => {
  try {
    const dto = new LoginRequestDTO(req.body);

    const result = await authService.login(dto);

    const response = new LoginResponseDTO(result);

    res.status(200).json(new ApiResponse(200, response, "Login successful"));
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (_req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json(new ApiResponse(200, users, "Users retrieved successfully"));
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const dto = new CreateUserDTO(req.body);

    const result = await authService.register(dto);

    const response = new LoginResponseDTO(result);

    res.status(201).json(new ApiResponse(201, response, "User created successfully"));
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    const tokens = await authService.refreshToken(token);

    res.status(200).json(new ApiResponse(200, tokens, "Token refreshed successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await authService.deleteUser(userId);
    res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const changeUserPassword = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json(new ApiResponse(400, null, "Password must be at least 8 characters"));
    }
    await authService.changeUserPassword(userId, newPassword);
    res.status(200).json(new ApiResponse(200, null, "Password updated successfully"));
  } catch (error) {
    next(error);
  }
};