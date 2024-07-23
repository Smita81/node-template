import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.TOKEN_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        // Store the decoded user information in the request object
        req.user = decoded;
        next();
    });
};

export default verifyToken;
