import { LoginRequestDTO } from "../dto/login-request.dto.js";
import { LoginResponseDTO } from "../dto/login-response.dto.js";
import { CreateUserDTO } from "../dto/create-user.dto.js";
import authService from "../services/auth.service.js";

export const login = async (req, res, next) => {
  try {
    const dto = new LoginRequestDTO(req.body);

    const result = await authService.login(dto);

    const response = new LoginResponseDTO(result);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (_req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const dto = new CreateUserDTO(req.body);

    const result = await authService.register(dto);

    const response = new LoginResponseDTO(result);

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "refreshToken is required" });
    }

    const tokens = await authService.refreshToken(token);

    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
};