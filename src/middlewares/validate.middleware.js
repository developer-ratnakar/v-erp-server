import ApiError from "../errors/ApiError.js";

const getValidationTargets = (schema) => {
  if (typeof schema.safeParse === "function") {
    return { body: schema };
  }

  return schema;
};

export const validate = (schema) => (req, res, next) => {
  const targets = getValidationTargets(schema);
  const validationErrors = [];

  for (const [key, validator] of Object.entries(targets)) {
    if (!validator) {
      continue;
    }

    const result = validator.safeParse(req[key]);

    if (!result.success) {
      validationErrors.push(
        ...result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      );
      continue;
    }

    if (key === "query") {
      Object.keys(req.query).forEach((queryKey) => {
        delete req.query[queryKey];
      });
      Object.assign(req.query, result.data);
      continue;
    }

    req[key] = result.data;
  }

  if (validationErrors.length > 0) {
    return next(new ApiError(400, "Validation failed", validationErrors));
  }

  next();
};
