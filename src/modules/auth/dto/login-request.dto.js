import Joi from "joi";
import ApiError from "../../../errors/ApiError.js";

const schema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).max(50).required().messages({
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password cannot exceed 50 characters",
    "any.required": "Password is required",
  }),
});

export class LoginRequestDTO {
  constructor(data) {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
      throw new ApiError(400, error.details.map((d) => d.message).join(", "));
    }
    this.email = value.email;
    this.password = value.password;
  }
}
