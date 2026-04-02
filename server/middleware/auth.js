import jwt from 'jsonwebtoken';

export const requireAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_development');

        // You could check decoded.role === 'admin' later if you have multiple roles
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

export const requireUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No customer token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_development');

        if (decoded.role !== 'customer') {
            return res.status(403).json({ error: 'Customer access required.' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired customer token.' });
    }
};
