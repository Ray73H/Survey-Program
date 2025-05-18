import bcrypt from "bcrypt";
import User from "../models/Users.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function createUser(email, password, name, accountType) {
	try {
		// Connect to MongoDB
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB");

		// Create the user - let the User model handle password hashing
		const user = new User({
			email,
			password, // Pass the plain password, let the model hash it
			name,
			accountType,
		});

		// Save the user
		await user.save();
		console.log("User created successfully:", { email, name, accountType });
	} catch (error) {
		console.error("Error creating user:", error);
	} finally {
		// Close the database connection
		await mongoose.connection.close();
		console.log("Database connection closed");
	}
}

// Example usage:
// Replace these values with the user details you want to create
const userDetails = {
	email: "experimentee@gmail.com",
	password: "1234",
	name: "Experimentee User",
	accountType: "experimentee",
};

createUser(userDetails.email, userDetails.password, userDetails.name, userDetails.accountType);
