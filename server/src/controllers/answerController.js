import Answer from "../models/Answers.js";
import Survey from "../models/Surveys.js";

export const createAnswer = async (req, res) => {
	try {
		const { surveyId, respondentType } = req.body;

		if (req.body.respondentId) {
			const existingAnswer = await Answer.findOne({ surveyId, respondentId: req.body.respondentId });
			if (existingAnswer) {
				return res.status(400).json({ message: "Answer already exists" });
			}
		}

		const newAnswer = new Answer({ surveyId, respondentType, respondentId: req.body?.respondentId || null });
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
		const { surveyId, userId } = req.query;
		const answer = await Answer.find({ surveyId, respondentId: userId });
		res.status(200).json(answer);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getCompletedSurveyAnswers = async (req, res) => {
	try {
		const { userId } = req.query;
		const answers = await Answer.find({ respondentId: userId, completed: true });

		const populatedAnswers = await Promise.all(
			answers.map(async (answer) => {
				const survey = await Survey.findOne({ _id: answer.surveyId }).select(
					"title description questions author"
				);
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

		res.status(200).json(populatedAnswers);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getSavedSurveyAnswers = async (req, res) => {
	try {
		const { userId } = req.query;
		const answers = await Answer.find({ respondentId: userId, completed: false });

		const populatedAnswers = await Promise.all(
			answers.map(async (answer) => {
				const survey = await Survey.findOne({ _id: answer.surveyId }).select(
					"title description questions author"
				);
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

		res.status(200).json(populatedAnswers);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const getThreeUncompletedSurveyAnswers = async (req, res) => {
	try {
		const { userId } = req.query;
		const answers = await Answer.find({ respondentId: userId, started: true, completed: false })
			.sort({ updatedAt: -1 })
			.limit(3);

		const populatedAnswers = await Promise.all(
			answers.map(async (answer) => {
				const survey = await Survey.findOne({ _id: answer.surveyId }).select(
					"title description questions author"
				);
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
