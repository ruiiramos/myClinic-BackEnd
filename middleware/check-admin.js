module.exports = (req, res, next) => {
    // Checking if the user is an administrator
    if (req.userData.tipo == 'admin') {
        // If the user is an administrator, pass control to the next middleware function
        next();
    } else {
        // If the user is not an administrator, respond with a 403 Forbidden status and an error message
        return res.status(403).json({
            msg: 'Only administrators can perfom this action'
        });
    }
}