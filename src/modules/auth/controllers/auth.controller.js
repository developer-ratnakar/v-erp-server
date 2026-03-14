import { LoginRequestDTO } from "../dto/login-request.dto.js";
import { LoginResponseDTO } from "../dto/login-response.dto.js";
import { CreateUserDTO } from "../dto/create-user.dto.js";
import authService from "../services/auth.service.js";

export const login = async (req, res) => {
  try {
    const dto = new LoginRequestDTO(req.body);

    const result = await authService.login(dto);

    const response = new LoginResponseDTO(result);

    res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const dto = new CreateUserDTO(req.body);

    const result = await authService.register(dto);

    const response = new LoginResponseDTO(result);

    res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
