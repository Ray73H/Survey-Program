import { Schema, model } from "mongoose";

const questionSchema = new Schema({
	questionType: String,
	questionText: String,
	options: [String],
});

const surveySchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		title: String,
		description: String,
		public: Boolean,
		pinCode: { type: String, unique: true },
		questions: [questionSchema],
		author: String,
	},
	{ timestamps: true }
);

export default model("Survey", surveySchema);
