const jwt = require('jsonwebtoken');

const protectRoute = (req, res, next) => {
    // ✅ 1. Try to get token from cookie or Authorization header
    let token = req.cookies?.__Token;

    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        // Expected format: "Bearer <token>"
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }
    // ✅ 2. If token not found
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        // ✅ 3. Verify token
        const decoded = jwt.verify(token, "zqwppa4wczn59nv4jjc3knke9xkr2e6gqajc7b9shc8f76ufncpuwh2686cda5qr");
        req.user = decoded; // Attach decoded user info

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = protectRoute;
