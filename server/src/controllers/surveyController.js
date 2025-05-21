import Survey from "../models/Surveys.js";
import User from "../models/Users.js";

async function generatePinCode() {
	let pinCode;
	let isUnique = false;
	while (!isUnique) {
		pinCode = Math.floor(1000 + Math.random() * 9000).toString();
		const existingSurvey = await Survey.findOne({ pinCode });
		if (!existingSurvey) isUnique = true;
	}
	return pinCode;
}

export const createSurvey = async (req, res) => {
	try {
		const { userId, author } = req.body;
		const pinCode = await generatePinCode();

		const latestSurvey = await Survey.find({ userId, title: { $regex: /^Survey \d+$/ } })
			.sort({ title: -1 })
			.limit(1);
		let surveyNum = 1;
		if (latestSurvey.length > 0) {
			surveyNum = parseInt(latestSurvey[0].title.split(" ")[1]) + 1;
		}
		const title = `Survey ${surveyNum}`;

		const newSurvey = new Survey({
			userId,
			title,
			pinCode,
			author,
		});

		const savedSurvey = await newSurvey.save();
		res.status(201).json(savedSurvey);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const importSurvey = async (req, res) => {
	try {
		const { userId, title, questions, author } = req.body;
		const pinCode = await generatePinCode();

		const newSurvey = new Survey({
			userId,
			title,
			description: req.body?.description || "",
			questions,
			pinCode,
			author,
			imported: true,
		});

		const savedSurvey = await newSurvey.save();
		res.status(201).json(savedSurvey);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
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
		res.status(500).json({ message: "Internal server error: " + error.message });
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
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getAllSurveys = async (req, res) => {
	try {
		const surveys = await Survey.find();
		res.status(200).json(surveys);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getSurveysByUserId = async (req, res) => {
	try {
		const { userId } = req.params;
		const surveys = await Survey.find({ userId });
		res.status(200).json(surveys);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getUnpublishedSurveys = async (req, res) => {
	try {
		const { userId } = req.params;
		const surveys = await Survey.find({ userId, published: false }).sort({ updatedAt: -1 });
		res.status(200).json(surveys);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getOngoingSurveys = async (req, res) => {
	try {
		const { userId } = req.params;
		const now = new Date();
		const surveys = await Survey.find({
			userId,
			deadline: { $gt: now },
		}).sort({ deadline: 1 });
		res.status(200).json(surveys);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
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
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getPublicSurveys = async (req, res) => {
	try {
		const survey = await Survey.find({ public: true });
		res.status(200).json(survey);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getSurveyByPinCode = async (req, res) => {
	try {
		const { pinCode } = req.params;
		const survey = await Survey.findOne({ pinCode });

		if (!survey) {
			return res.status(404).json({ message: "Survey not found" });
		}

		if (req.user?.userId) {
			const user = await User.findById(req.user.userId);
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
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};
