import studentService from "../services/student.service.js";
import { getPagination } from "../../../utils/pagination.js";

export const createStudent = async (req, res, next) => {
  try {
    console.log("Creating student with body:", req.body);
    const student = await studentService.createStudent(req.body);
    console.log("Student created successfully:", student.id);
    res.status(201).json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    next(error);
  }
};

export const getAllStudents = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    pagination.search = _req.query.search;
    pagination.program_id = _req.query.program_id;
    pagination.department_id = _req.query.department_id;
    pagination.batch_id = _req.query.batch_id;
    pagination.semester_id = _req.query.semester_id;
    const students = await studentService.getAllStudents(pagination);
    res.status(200).json({
      data: students.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: students.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.studentId);
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req, res, next) => {
  try {
    const student = await studentService.updateStudent(req.params.studentId, req.body);
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  try {
    await studentService.deleteStudent(req.params.studentId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const saveStudentParent = async (req, res, next) => {
  try {
    console.log(`Saving parent for student ${req.params.studentId}:`, req.body);
    const parent = await studentService.saveStudentParent(req.params.studentId, req.body);
    console.log("Parent saved successfully");
    res.status(200).json(parent);
  } catch (error) {
    console.error("Error saving parent:", error);
    next(error);
  }
};

export const getStudentParent = async (req, res, next) => {
  try {
    const parent = await studentService.getStudentParent(req.params.studentId);
    res.status(200).json(parent);
  } catch (error) {
    next(error);
  }
};

export const deleteStudentParent = async (req, res, next) => {
  try {
    await studentService.deleteStudentParent(req.params.studentId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createStudentAddress = async (req, res, next) => {
  try {
    console.log(`Creating address for student ${req.params.studentId}:`, req.body);
    const address = await studentService.createStudentAddress(req.params.studentId, req.body);
    console.log("Address created successfully");
    res.status(201).json(address);
  } catch (error) {
    console.error("Error creating address:", error);
    next(error);
  }
};

export const getStudentAddresses = async (req, res, next) => {
  try {
    const addresses = await studentService.getStudentAddresses(req.params.studentId);
    res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
};

export const updateStudentAddress = async (req, res, next) => {
  try {
    const address = await studentService.updateStudentAddress(req.params.studentId, req.params.addressId, req.body);
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

export const deleteStudentAddress = async (req, res, next) => {
  try {
    await studentService.deleteStudentAddress(req.params.studentId, req.params.addressId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createStudentDocument = async (req, res, next) => {
  try {
    const document = await studentService.createStudentDocument(req.params.studentId, req.body);
    res.status(201).json(document);
  } catch (error) {
    next(error);
  }
};

export const getStudentDocuments = async (req, res, next) => {
  try {
    const documents = await studentService.getStudentDocuments(req.params.studentId);
    res.status(200).json(documents);
  } catch (error) {
    next(error);
  }
};

export const updateStudentDocument = async (req, res, next) => {
  try {
    const document = await studentService.updateStudentDocument(req.params.studentId, req.params.documentId, req.body);
    res.status(200).json(document);
  } catch (error) {
    next(error);
  }
};

export const deleteStudentDocument = async (req, res, next) => {
  try {
    await studentService.deleteStudentDocument(req.params.studentId, req.params.documentId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const changeStudentDepartment = async (req, res, next) => {
  try {
    const result = await studentService.changeStudentDepartment(req.params.studentId, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getStudentDepartmentTransfers = async (req, res, next) => {
  try {
    const transfers = await studentService.getStudentDepartmentTransfers(req.params.studentId);
    res.status(200).json(transfers);
  } catch (error) {
    next(error);
  }
};
