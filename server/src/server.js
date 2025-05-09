import express, { json } from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import surveyRoutes from "./routes/surveyRoutes.js";
import userRoutes from "./routes/userRoutes.js";

config();
const app = express();

app.use(express.json());

connectDB();

app.use("/api/surveys", surveyRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
