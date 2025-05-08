import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Missing or invalid auth token" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded; // contains e.g., { id, email }
		next();
	} catch (err) {
		console.error("Auth error:", err.message);
		res.status(403).json({ message: "Invalid or expired token" });
	}
};

export default authMiddleware;
