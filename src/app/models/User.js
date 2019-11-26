const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name:{
        type : String,
        require : true
    },
    email:{
        type : String,
        require : true,
        unique : true,
        lowercase : true,
    },
    password:{
        type : String,
        require : true,
        select : false,
    },
    passwordResetToken:{
        type: String,
        select : false
    },
    passwordResetExpires:{
        type : Date,
        select : false
    },
    createdAt:{
        type : Date,
        default : Date.now
    },
    id_user_last_edit: { //chave estrangera
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
});

UserSchema.pre('save' , async function(next){
    const hash =  await bcrypt.hash(this.password , 10); //(10 = quantas vezes vai encriptar)
    this.password = hash;

    next();
}) //antes de salvar ele faz algo (.pre)
const User = mongoose.model('User', UserSchema);

module.exports = User;