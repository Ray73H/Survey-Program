import { Schema, model } from "mongoose";

const answerSchema = new Schema(
	{
		surveyId: {
			type: Schema.Types.ObjectId,
			ref: "Survey",
			required: true,
		},
		respondentType: {
			type: String,
			enum: ["user", "guest"],
			required: true,
		},
		respondentId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: function () {
				return this.respondentType === "user";
			},
		},
		answers: {
			type: [
				{
					questionNumber: Number,
					answer: Schema.Types.Mixed,
					timestamp: Date,
				},
			],
			default: [],
		},
		started: {
			type: Boolean,
			default: false,
		},
		completed: {
			type: Boolean,
			default: false,
		},
		startedAt: Date,
		completedAt: Date,
	},
	{ timestamps: true }
);

export default model("Answer", answerSchema);
