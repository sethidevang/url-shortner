const jwt = require('jsonwebtoken');
require('dotenv').config();

const userId = '173527c4-1d5d-4ec2-9552-68f6e2e46c84';
const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
});

console.log(token);
