import ApiError from "../../../errors/ApiError.js";
import academicRepository from "../../academic/repositories/academic.repository.js";
import authRepository from "../../auth/repositories/auth.repository.js";
import hrRepository from "../repositories/hr.repository.js";

class HRService {
  async createStaff(dto) {
    const existingStaff = await hrRepository.findStaffByEmail(dto.email);

    if (existingStaff) {
      throw new ApiError(409, "Staff email already exists");
    }

    await this.validateReferences(dto);

    return await hrRepository.createStaff(dto);
  }

  async getAllStaff(pagination) {
    return await hrRepository.getAllStaff(pagination);
  }

  async getStaffById(staffId) {
    const staff = await hrRepository.findStaffById(staffId);

    if (!staff) {
      throw new ApiError(404, "Staff not found");
    }

    return staff;
  }

  async updateStaff(staffId, dto) {
    const staff = await this.getStaffById(staffId);

    if (dto.email && dto.email !== staff.email) {
      const existingStaff = await hrRepository.findStaffByEmail(dto.email);
      if (existingStaff) {
        throw new ApiError(409, "Staff email already exists");
      }
    }

    await this.validateReferences(dto);

    return await hrRepository.updateStaff(staffId, dto);
  }

  async deleteStaff(staffId) {
    await this.getStaffById(staffId);
    await hrRepository.deleteStaff(staffId);
  }

  async validateReferences(dto) {
    const checks = [];

    if (dto.department_id) {
      checks.push(
        academicRepository.findDepartmentById(dto.department_id).then((department) => {
          if (!department) throw new ApiError(404, "Department not found");
        }),
      );
    }

    if (dto.user_id) {
      checks.push(
        authRepository.findUserById(dto.user_id).then((user) => {
          if (!user) throw new ApiError(404, "User not found");
        }),
      );
    }

    await Promise.all(checks);
  }
}

export default new HRService();
