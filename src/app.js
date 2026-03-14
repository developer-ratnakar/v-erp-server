
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import indexRouter from "./routes/index.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", indexRouter);
app.use(errorHandler);

export default app;
