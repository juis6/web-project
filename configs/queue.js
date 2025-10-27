require('dotenv').config();

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

const Queue = require('bull');

const taskQueue = new Queue('taskQueue', {
    redis: { host: REDIS_HOST, port: REDIS_PORT },
});

module.exports = taskQueue;