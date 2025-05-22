import { connect } from "mongoose";

const connectDB = async () => {
	try {
		console.log(process.env.MONGO_URI)
		await connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB connected");
	} catch (error) {
		console.error("MongoDB connection failed:", error.message);
		process.exit(1);
	}
};

export default connectDB;
