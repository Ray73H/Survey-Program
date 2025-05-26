import Answer from "../models/Answers.js";
import Survey from "../models/Surveys.js";

const populateAnswersWithSurveyDetails = async (answers) => {
	return Promise.all(
		answers.map(async (answer) => {
			const survey = await Survey.findOne({ _id: answer.surveyId }).select("title description questions author");
			if (survey) {
				return {
					...answer.toObject(),
					surveyTitle: survey.title,
					surveyDescription: survey.description,
					surveyQuestions: survey.questions,
					surveyAuthor: survey.author,
				};
			}
			return answer.toObject();
		})
	);
};

export const createAnswer = async (req, res) => {
	try {
		const { surveyId, respondentType } = req.body;

		if (req.body.respondentId || req.body.guestId) {
			const existingUser = await Answer.findOne({ surveyId, respondentId: req.body.respondentId });
			const existingGuest = await Answer.findOne({ surveyId, guestId: req.body.guestId });
			if (existingUser || existingGuest) {
				return res.status(400).json({ message: "Answer already exists" });
			}
		}

		const newAnswer = new Answer({
			surveyId,
			respondentType,
			respondentId: req.body?.respondentId || null,
			guestId: req.body?.guestId || null,
		});
		const savedAnswer = await newAnswer.save();
		res.status(201).json(savedAnswer);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const updateAnswer = async (req, res) => {
	try {
		const { id } = req.params;
		const updatedAnswer = await Answer.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!updatedAnswer) {
			return res.status(404).json({ message: "Answer not found" });
		}

		res.status(200).json(updatedAnswer);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getAnswer = async (req, res) => {
	try {
		const { surveyId, guest, userId } = req.query;
		const query = { surveyId };
		query[guest === "true" ? "guestId" : "respondentId"] = userId;

		const answer = await Answer.find(query);
		res.status(200).json(answer);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getCompletedSurveyAnswers = async (req, res) => {
	try {
		const { guest, userId } = req.query;
		const query = { completed: true };
		query[guest === "true" ? "guestId" : "respondentId"] = userId;

		const answers = await Answer.find(query);
		const populatedAnswers = await populateAnswersWithSurveyDetails(answers);
		res.status(200).json(populatedAnswers);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getSavedSurveyAnswers = async (req, res) => {
	try {
		const { guest, userId } = req.query;
		const query = { completed: false };
		query[guest === "true" ? "guestId" : "respondentId"] = userId;

		const answers = await Answer.find(query);
		const populatedAnswers = await populateAnswersWithSurveyDetails(answers);
		res.status(200).json(populatedAnswers);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getThreeUncompletedSurveyAnswers = async (req, res) => {
	try {
		const { guest, userId } = req.query;
		const query = { started: true, completed: false };
		query[guest === "true" ? "guestId" : "respondentId"] = userId;

		const answers = await Answer.find(query).sort({ updatedAt: -1 }).limit(3);
		const populatedAnswers = await populateAnswersWithSurveyDetails(answers);
		res.status(200).json(populatedAnswers);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getAnswersBySurveyId = async (req, res) => {
	try {
		const { surveyId } = req.body;
		const answers = await Answer.find({ surveyId });
		res.status(200).json(answers);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};
