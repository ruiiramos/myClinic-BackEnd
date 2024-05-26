const Admin = require('../models/admin.model')

module.exports = async (req, res, next) => {
    try {
        const admin = await Admin.findOne({ _id: req.userData.userId, isAdmin: true });

        if (admin) {
            next();
        } else {
            return res.status(403).json({
                msg: 'Only administrators can perform this action'
            });
        }
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
};