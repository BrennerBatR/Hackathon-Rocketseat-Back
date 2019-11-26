const mongoose = require('../../database');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        require: true
    },
    assignedTo: { //chave estrangera
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    completed:{
      type: Boolean,
      default : false  
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;