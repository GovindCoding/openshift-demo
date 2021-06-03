const jwt = require('jsonwebtoken');
const constants = require('../utils/constants.json');

exports.ensureAuthorized = (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
        token = token.substring(7);
        jwt.verify(token, constants.SECRET_KEY, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.sendStatus(440);
                } else {
                    return res.sendStatus(403);
                }
            } else {
                next();
            }
        });
    } else {
        return res.sendStatus(403);
    }
}