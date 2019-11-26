const mongoose = require('../../database');

const MessageSchema = new mongoose.Schema({
    author:{
        type : String,
        require : true
    },
    message:{
        type : String,
        required : true
    },
    dtt_insert:{
        type : Date,
        default : Date.now
    },
    id_user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require : true
    },
    id_user_to:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: false 
    }
});


const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;