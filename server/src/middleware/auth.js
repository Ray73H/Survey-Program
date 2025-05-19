import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Missing or invalid auth token" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		console.error("Auth error:", err.message);
		res.status(403).json({ message: "Invalid or expired token" });
	}
};

export const authOptional = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (authHeader?.startsWith("Bearer ")) {
		const token = authHeader.split(" ")[1];

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded;
		} catch (err) {
			console.warn("Invalid token provided, continuing unauthenticated");
		}
	}

	next();
};
