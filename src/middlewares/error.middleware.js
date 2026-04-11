import ApiError from "../errors/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Standardize error if it's not already an ApiError
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || error.status || 500;
    let message = error.message || "Internal Server Error";

    // Intercept generic 'fetch failed' (e.g. Supabase ENOTFOUND when paused)
    if (message.includes("fetch failed") || (error.cause && error.cause.code === "ENOTFOUND")) {
      statusCode = 503;
      message = "Database connection failed. If you are using a free-tier Supabase instance, it might be paused due to inactivity. Please check your Supabase dashboard.";
    }

    error = new ApiError(statusCode, message, [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
