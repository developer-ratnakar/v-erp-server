import Joi from "joi";
import ApiError from "../../../errors/ApiError.js";

const schema = Joi.object({
  firstName: Joi.string().min(1).max(50).required().messages({
    "string.min": "First name cannot be empty",
    "string.max": "First name cannot exceed 50 characters",
    "any.required": "First name is required",
  }),
  middleName: Joi.string().max(50).optional().allow("", null).messages({
    "string.max": "Middle name cannot exceed 50 characters",
  }),
  lastName: Joi.string().min(1).max(50).required().messages({
    "string.min": "Last name cannot be empty",
    "string.max": "Last name cannot exceed 50 characters",
    "any.required": "Last name is required",
  }),
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

export class CreateUserDTO {
  constructor(data) {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
      throw new ApiError(400, error.details.map((d) => d.message).join(", "));
    }
    this.firstName = value.firstName;
    this.middleName = value.middleName ?? null;
    this.lastName = value.lastName;
    this.email = value.email;
    this.password = value.password;
  }
}
