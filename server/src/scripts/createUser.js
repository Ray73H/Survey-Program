import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/Users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function createSuperUser({ email, password, name }) {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB");

		const user = new User({
			email,
			password,
			name,
			accountType: "superuser",
		});

		await user.save();
		console.log("Superuser created:", { email, name });
	} catch (error) {
		console.error("Error creating superuser:", error.message);
	} finally {
		await mongoose.disconnect();
		console.log("MongoDB connection closed");
	}
}

if (process.argv.length !== 5) {
	console.log("Usage: node scripts/createSuperUser.js <email> <password> <name>");
	process.exit(1);
}

const [email, password, name] = process.argv.slice(2);

createSuperUser({ email, password, name });
