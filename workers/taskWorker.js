require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const taskQueue = require('../configs/queue.js');
const connectDB = require('../configs/db.js');
const Task = require('../models/Task.js');

console.log('Worker is running...');
connectDB(MONGODB_URI);

taskQueue.process(async (job) => {
    try {
        const { taskId, request, delay } = job.data;
        await Task.findByIdAndUpdate(taskId, { status: 'active' });
        for (let i = 0; i <= 100; i += 1) {
            const currentTask = await Task.findById(taskId);
            if (currentTask.status === 'canceled') {
                job.moveToFailed();
                return
            }
            await Task.findByIdAndUpdate(taskId, { progress: i });
            job.progress(i);
            await new Promise((resolve) => setTimeout(resolve, delay / 100));
        }
        const response = request;
        await Task.findByIdAndUpdate(taskId, {
            response: response,
            status: 'completed',
        });
    } catch (error) {
        console.error(error.message);
    }
});