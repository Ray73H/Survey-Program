import express from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import surveyRoutes from "./routes/surveyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import answerRoutes from "./routes/answerRoutes.js";

config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/surveys", surveyRoutes);
app.use("/api/answers", answerRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
