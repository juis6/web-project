const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    request: {
        type: String,
        required: true
    },
    response: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'canceled', 'delayed', 'aborted'],
        default: 'delayed'
    },
    progress: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);