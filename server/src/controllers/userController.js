import User from "../models/Users.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
	try {
		const { email, password, name, accountType } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		const user = new User({ email, password, name, accountType });
		await user.save();

		const token = jwt.sign(
			{
				userId: user._id,
				email: user.email,
				name: user.name,
				accountType: user.accountType,
				surveyAccess: user.surveyAccess,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "6h" }
		);

		res.status(201).json({ token });
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (!(await user.comparePassword(password))) {
			return res.status(401).json({ message: "Incorrect Password" });
		}

		const token = jwt.sign(
			{
				userId: user._id,
				email: user.email,
				name: user.name,
				accountType: user.accountType,
				surveyAccess: user.surveyAccess,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "6h" }
		);

		res.status(200).json({ token });
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedUser = await User.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(updatedUser);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedUser = await User.findByIdAndDelete(id);

		if (!deletedUser) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findOne({ "_id" : id });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const addSurveyAccess = async (req, res) => {
	try {
		const { id } = req.params; // user ID
		const { surveyId } = req.body; // survey ID to add
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Only add if not already present
		if (!user.surveyAccess.includes(surveyId)) {
			user.surveyAccess.push(surveyId);
			await user.save();
		}

		res.status(200).json({ message: "Survey access added", surveyAccess: user.surveyAccess });
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};