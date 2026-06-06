const jwt = require('jsonwebtoken');

const SECRET  = process.env.JWT_SECRET  || 'change_this_in_production';
const EXPIRES = process.env.JWT_EXPIRES || '7d';

const sign   = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES });
const verify = (token)   => jwt.verify(token, SECRET);

module.exports = { sign, verify };
