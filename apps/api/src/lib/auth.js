import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is missing from apps/api/.env");

export function signToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
}

// Express middleware — requires a valid "Authorization: Bearer <token>" header.
// On success, sets req.user = { id, username }.
export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or malformed Authorization header" });
    }
    const token = header.slice("Bearer ".length);
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

// Optional-auth version — attaches req.user if a valid token is present,
// but doesn't reject the request if it's missing. Useful for routes that
// behave slightly differently for logged-in vs anonymous users.
export function attachUserIfPresent(req, res, next) {
    const header = req.headers.authorization;
    if (header?.startsWith("Bearer ")) {
        try {
            req.user = jwt.verify(header.slice("Bearer ".length), JWT_SECRET);
        } catch {
            // invalid token — just proceed as anonymous, don't error
        }
    }
    next();
}