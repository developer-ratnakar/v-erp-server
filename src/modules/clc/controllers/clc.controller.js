import clcService from "../services/clc.service.js";
import { getPagination } from "../../../utils/pagination.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";

export const createCertificate = async (req, res, next) => {
  try {
    const certificate = await clcService.createCertificate(req.body);
    res.status(201).json(new ApiResponse(201, certificate, "Certificate created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getAllCertificates = async (_req, res, next) => {
  try {
    const pagination = getPagination(_req.query);
    const certificates = await clcService.getAllCertificates(pagination);
    res.status(200).json(new ApiResponse(200, {
      data: certificates.data,
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total: certificates.count,
      },
    }, "Certificates retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const getCertificateById = async (req, res, next) => {
  try {
    const certificate = await clcService.getCertificateById(req.params.certificateId);
    res.status(200).json(new ApiResponse(200, certificate, "Certificate retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateCertificate = async (req, res, next) => {
  try {
    const certificate = await clcService.updateCertificate(req.params.certificateId, req.body);
    res.status(200).json(new ApiResponse(200, certificate, "Certificate updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteCertificate = async (req, res, next) => {
  try {
    await clcService.deleteCertificate(req.params.certificateId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCertificatesByStudentId = async (req, res, next) => {
  try {
    const certificates = await clcService.getCertificatesByStudentId(req.params.studentId);
    res.status(200).json(new ApiResponse(200, certificates, "Certificates retrieved successfully"));
  } catch (error) {
    next(error);
  }
};
