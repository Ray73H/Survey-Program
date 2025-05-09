import Survey from "../models/Survey.js";
import User from "../models/Users";

export const createSurvey = async (req, res) => {
	try {
		const newSurvey = new Survey(req.body);

		const savedSurvey = await newSurvey.save();
		res.status(201).json(savedSurvey);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const updateSurvey = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedSurvey = await Survey.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!updatedSurvey) {
			return res.status(404).json({ message: "Survey not found" });
		}

		res.status(200).json(updatedSurvey);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteSurvey = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedSurvey = await Survey.findByIdAndDelete(id);

		if (!deletedSurvey) {
			return res.status(404).json({ message: "Survey not found" });
		}

		res.status(200).json({ message: "Survey deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getAllSurveys = async (req, res) => {
	try {
		const surveys = await Survey.find();
		res.status(200).json(surveys);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getSurveysByUserId = async (req, res) => {
	try {
		const { userId } = req.params;
		const surveys = await Survey.find({ userId });
		res.status(200).json(surveys);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getSurveyById = async (req, res) => {
	try {
		const { id } = req.params;
		const survey = await Survey.findById(id);

		if (!survey) {
			return res.status(404).json({ message: "Survey not found" });
		}

		res.status(200).json(survey);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getPublicSurveys = async (req, res) => {
	try {
		const survey = await Survey.find({ public: true });
		res.status(200).json(survey);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getSurveyByPinCode = async (req, res) => {
	try {
		const { pinCode } = req.params;
		const survey = await Survey.find({ pinCode });

		if (!survey) {
			return res.status(404).json({ message: "Survey not found" });
		}

		if (req.user?.id) {
			const user = await User.findById(req.user.id);
			if (user) {
				const alreadyHasAccess = user.surveyAccess.some((id) => id.toString() === survey._id.toString());
				if (!alreadyHasAccess) {
					user.surveyAccess.push(survey._id);
					await user.save();
				}
			}
		}

		res.status(200).json(survey);
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};
