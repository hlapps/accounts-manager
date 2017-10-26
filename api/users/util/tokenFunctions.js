'use strict';
require('dotenv').config({ path: '../../../.env' });

const jwt = require('jsonwebtoken');

const createToken = (user) => {
    let scopes;
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            scope: user.scope
        },
        process.env.KEY,
        {
            algorithm: 'HS256',
            expiresIn: "1h"
        });
}

module.exports = {
    createToken
};