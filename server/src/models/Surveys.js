import { Schema, model } from "mongoose";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Copenhagen');


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
		title: { type: String, required: true },
		description: { type: String, default: "" },
		public: { type: Boolean, default: false },
		pinCode: { type: String, unique: true },
		questions: { type: [questionSchema], default: [] },
		author: { type: String, required: true },
		imported: { type: Boolean, default: false },
		published: { type: Boolean, default: false },
		deadline: { type: Date, default: dayjs.utc().add(7, 'day') },
		deleted_at: { type: Date, default: null },
	},
	{ timestamps: true }
);

export default model("Survey", surveySchema);
