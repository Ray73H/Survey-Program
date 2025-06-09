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
			if ((respondentType === "user" && existingUser) || (respondentType === "guest" && existingGuest)) {
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

export const getResponseStatsByUser = async (req, res) => {
	try {
		const surveys = await Survey.find({}, "_id userId");
		const surveyMap = {};
		surveys.forEach((s) => {
			surveyMap[s._id.toString()] = s.userId.toString();
		});

		const answers = await Answer.find({}, "surveyId");
		const stats = {};

		answers.forEach((answer) => {
			const surveyOwner = surveyMap[answer.surveyId.toString()];
			if (surveyOwner) {
				if (!stats[surveyOwner]) stats[surveyOwner] = 0;
				stats[surveyOwner]++;
			}
		});

		res.status(200).json(stats);
	} catch (err) {
		console.error("Error getting response stats:", err);
		res.status(500).json({ message: err.message });
	}
};

export const getAllAnswers = async (req, res) => {
	try {
		const surveys = await Answer.find();
		res.status(200).json(surveys);
	} catch (error) {
		res.status(500).json({ message: "Internal server error: " + error.message });
	}
};

export const calculateSurveyMetrics = async (req, res) => {
	try {
		const startedAnswers = await Answer.find({ startedAt: { $ne: null } });
		const completedAnswers = await Answer.find({ completedAt: { $ne: null } });

		const startedCount = startedAnswers.length || 0;
		const completedCount = completedAnswers.length || 0;

		const completionRate = startedCount ? (completedCount / startedCount) * 100 : 0;

		const totalCompletionTime = completedAnswers.reduce((acc, answer) => {
			if (answer.startedAt && answer.completedAt) {
				return acc + (new Date(answer.completedAt) - new Date(answer.startedAt));
			}
			return acc;
		}, 0);

		const avgCompletionTime = completedCount
			? totalCompletionTime / completedCount / (1000 * 60)
			: 0;

		const allAnswers = await Answer.find({}).select("surveyId").lean();
		const uniqueSurveys = new Set(allAnswers.map((a) => a.surveyId?.toString()).filter(Boolean));
		const avgUsersPerSurvey = uniqueSurveys.size
			? allAnswers.length / uniqueSurveys.size
			: 0;

		const detailedAnswers = await Answer.find({ completed: true })
			.populate({
				path: "surveyId",
				select: "questions",
			})
			.lean();

		let mcTimes = [],
			textTimes = [];

		detailedAnswers.forEach((ans) => {
			if (!ans.startedAt || !ans.completedAt || !ans.surveyId?.questions) return;
			const duration = new Date(ans.completedAt) - new Date(ans.startedAt);

			const hasMC = ans.surveyId.questions.some((q) => q.questionType === "multipleChoice");
			const hasText = ans.surveyId.questions.some((q) => q.questionType === "openText");

			if (hasMC) mcTimes.push(duration);
			if (hasText) textTimes.push(duration);
		});

		const avgTimeMC = mcTimes.length
			? mcTimes.reduce((a, b) => a + b, 0) / mcTimes.length / (1000 * 60)
			: 0;

		const avgTimeText = textTimes.length
			? textTimes.reduce((a, b) => a + b, 0) / textTimes.length / (1000 * 60)
			: 0;

		res.json({
			completionRate: completionRate.toFixed(2),
			averageCompletionTimeInMinutes: avgCompletionTime.toFixed(2),
			averageUsersPerSurvey: avgUsersPerSurvey.toFixed(2),
			averageTimeMultipleChoice: avgTimeMC.toFixed(2),
			averageTimeOpenText: avgTimeText.toFixed(2),
		});
	} catch (error) {
		console.error("Failed to compute survey metrics:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};


export const getAnswerMetricsPerSurvey = async (req, res) => {
	try {
		const answers = await Answer.find({}).lean();
		const surveyMetrics = {};

		answers.forEach((answer) => {
			const surveyId = answer.surveyId?.toString();
			if (!surveyId) return;

			if (!surveyMetrics[surveyId]) {
				surveyMetrics[surveyId] = {
					started: 0,
					completed: 0,
					totalTime: 0,
					respondents: new Set(),
				};
			}

			if (answer.startedAt) surveyMetrics[surveyId].started++;
			if (answer.startedAt && answer.completedAt) {
				surveyMetrics[surveyId].completed++;

				const duration = new Date(answer.completedAt) - new Date(answer.startedAt);
				if (duration > 0) {
					surveyMetrics[surveyId].totalTime += duration;
				}
			}

			// Support both user and guest respondents
			const respondentKey =
				answer.respondentType === "guest" ? answer.guestId : answer.respondentId?.toString();
			if (respondentKey) {
				surveyMetrics[surveyId].respondents.add(respondentKey);
			}
		});

		const result = Object.entries(surveyMetrics).map(([surveyId, data]) => {
			const completionRate = data.started ? (data.completed / data.started) * 100 : 0;
			const avgCompletionTime = data.completed
				? data.totalTime / data.completed / (1000 * 60)
				: 0;

			return {
				surveyId,
				completionRate: completionRate.toFixed(2),
				averageCompletionTimeInMinutes: avgCompletionTime.toFixed(2),
				uniqueParticipants: data.respondents.size,
			};
		});

		res.status(200).json(result);
	} catch (error) {
		console.error("Error calculating metrics per survey:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};



export const getAnswerMetricsPerQuestion = async (req, res) => {
	try {
		const answers = await Answer.find({}).lean();
		const questionMetrics = {};

		answers.forEach((answerDoc) => {
			const surveyId = answerDoc.surveyId?.toString();
			if (!surveyId || !Array.isArray(answerDoc.answers) || !answerDoc.startedAt) return;

			if (!questionMetrics[surveyId]) {
				questionMetrics[surveyId] = {};
			}

			const startedAt = new Date(answerDoc.startedAt);

			answerDoc.answers.forEach(({ questionNumber, answer, timestamp }) => {
				if (!questionNumber || !timestamp) return;

				if (!questionMetrics[surveyId][questionNumber]) {
					questionMetrics[surveyId][questionNumber] = {
						count: 0,
						answers: [],
						timeSumMs: 0,
						answeredCount: 0,
					};
				}

				const qStat = questionMetrics[surveyId][questionNumber];
				qStat.count++;
				qStat.answers.push(answer);

				const timeTaken = new Date(timestamp) - startedAt;
				if (timeTaken > 0) {
					qStat.timeSumMs += timeTaken;
					qStat.answeredCount++;
				}
			});
		});

		// Finalize calculations
		Object.entries(questionMetrics).forEach(([surveyId, questions]) => {
			Object.entries(questions).forEach(([questionNumber, stats]) => {
				const completionRate = stats.count
					? (stats.answeredCount / stats.count) * 100
					: 0;
				const averageTimeInMinutes = stats.answeredCount
					? stats.timeSumMs / stats.answeredCount / (1000 * 60)
					: 0;

				stats.completionRate = completionRate.toFixed(2);
				stats.averageTimeInMinutes = averageTimeInMinutes.toFixed(2);
			});
		});
		console.log("Per-question metrics:", JSON.stringify(questionMetrics, null, 2));
		res.status(200).json(questionMetrics);
	} catch (error) {
		console.error("Error calculating per-question metrics:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};



// controllers/AnswerController.js
export const getTotalResponses = async (req, res) => {
	try {
		const userId = req.user._id;
		const surveys = await Survey.find({ userId }, "_id");
		const surveyIds = surveys.map((survey) => survey._id);
		const count = await Answer.countDocuments({ surveyId: { $in: surveyIds } });
		res.json({ totalResponses: count });
	} catch (error) {
		console.error("Error fetching total responses:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// controllers/AnswerController.js
export const getAverageCompletionRate = async (req, res) => {
	try {
		const userId = req.user._id;
		const surveys = await Survey.find({ userId }, "_id");
		const surveyIds = surveys.map((s) => s._id);

		const answers = await Answer.find({ surveyId: { $in: surveyIds } });

		let total = 0;
		let completed = 0;

		answers.forEach((ans) => {
			if (ans.startedAt) total++;
			if (ans.startedAt && ans.completedAt) completed++;
		});

		const averageCompletionRate = total ? (completed / total) * 100 : 0;

		res.json({ averageCompletionRate: averageCompletionRate.toFixed(2) });
	} catch (error) {
		console.error("Error fetching average completion rate:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};



// controllers/AnswerController.js
export const getAverageCompletionTime = async (req, res) => {
	try {
		const userId = req.user._id;
		const surveys = await Survey.find({ userId }, "_id");
		const surveyIds = surveys.map((s) => s._id);

		const answers = await Answer.find({
			surveyId: { $in: surveyIds },
			startedAt: { $ne: null },
			completedAt: { $ne: null },
		});

		let totalTime = 0;
		let count = 0;

		answers.forEach((ans) => {
			const time = new Date(ans.completedAt) - new Date(ans.startedAt);
			if (time > 0) {
				totalTime += time;
				count++;
			}
		});

		const averageTime = count ? totalTime / count / (1000 * 60) : 0;

		res.json({ averageCompletionTime: averageTime.toFixed(2) });
	} catch (error) {
		console.error("Error fetching average completion time:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};



// controllers/AnswerController.js
export const getAverageUsersPerSurvey = async (req, res) => {
	try {
		const userId = req.user._id;
		const surveys = await Survey.find({ userId }, "_id");
		const surveyIds = surveys.map((s) => s._id);

		const answers = await Answer.aggregate([
			{ $match: { surveyId: { $in: surveyIds } } },
			{
				$group: {
					_id: "$surveyId",
					uniqueUsers: { $addToSet: "$respondentId" },
				},
			},
			{
				$project: {
					surveyId: "$_id",
					uniqueUserCount: { $size: "$uniqueUsers" },
				},
			},
		]);

		const totalUsers = answers.reduce((sum, a) => sum + a.uniqueUserCount, 0);
		const averageUsers = answers.length ? totalUsers / answers.length : 0;

		res.json({ averageUsersPerSurvey: averageUsers.toFixed(2) });
	} catch (error) {
		console.error("Error fetching average users per survey:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};
