module.exports = (req, res, next) => {
    const userIdFromToken = req.userData.user_id;

    const userIdFromRequest = req.params.user_id;

    if (userIdFromToken === userIdFromRequest) {
        next();
    } else {
        return res.status(403).json({
            msg: 'You are not authorized to perform this action'
        });
    }
};