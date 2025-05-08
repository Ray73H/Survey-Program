import express, { json } from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import orderRoutes from "./routes/orderRoutes";
import connectDB from "./config/db";
import surveyRoutes from "./routes/surveyRoutes"

dotenv.config();
const app = express();

app.use(express.json());

connectDB();

app.use("/api/surveys", surveyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
