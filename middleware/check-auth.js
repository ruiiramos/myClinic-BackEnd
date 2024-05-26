const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        req.userData = decoded;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                msg: 'Your token has expired. Please login again.'
            });
        } else {
            return res.status(401).json({
                msg: 'No access token provided'
            });
        }
    }
};