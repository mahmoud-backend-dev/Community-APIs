const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');
const User = require('../models/User');


const protectRoutes = asyncHandler(async (req, res, next) => {
    // 1) Check token is exists or not 
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer"))
        throw new UnauthenticatedError('No Bearer Token Provided')
    token = req.headers.authorization.split(" ")[1];
    // 2) Verify token (no change happens , expire data)
    const decoded = jwt.verify(token, process.env.SECERT_JWT);
    
    // 3 ) Check user if exists or not by given token
    const user = await User.findById(decoded.userId);
    if (!user )
        throw new UnauthenticatedError('The user that belong to this token does no longer exist')
    
    // 4 )  Check if user Change his Password after token created
    if (user.passwordChangeAt) {
        const timeStemp = parseInt((
            user.passwordChangeAt.getTime() / 1000
        ), 10)
        // If change his Password after create token (Error)
        if (timeStemp > decoded.iat)
            throw new UnauthenticatedError('User recently changed his password, please login again...')
    }
    req.user = user;
    next()
});

module.exports = protectRoutes;