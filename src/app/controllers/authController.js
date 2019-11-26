const express = require('express');
const bcrypt = require('bcryptjs'); //encrypta senha
const jwt = require('jsonwebtoken'); //gera token
const crypto = require('crypto');
const mailer = require('../../modules/mailer');
const authMiddleware = require("../middlewares/auth");

const authConfig = require('../../config/auth');

const User = require('../models/User');

const router = express.Router();


function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret,
        {
            expiresIn: 86400 //quando vai expirar ( 1 dia  em segundos)
        });//identificador unico e hash para saber se o token é da minaha aplicação
}

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password'); //inclui password na busca, pois ele esta selected : false no User.js

    if (!user)
        return res.status(404).send({ error: "User not found" });

    if (!await bcrypt.compare(password, user.password)) //verificando se as senhas batem
        return res.status(403).send({ error: "Invalid Password" });

    user.password = undefined;

    //gerando token
    res.send({
        user,
        token: generateToken({ id: user.id }),
    });
});


router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).send({ error: "User not found" });

        const token = crypto.randomBytes(20).toString('hex'); //gerando um token random
        const now = new Date();
        now.setHours(now.getHours() + 1); //expiração de 1 hora a mais

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });

        //enviar o email

        mailer.sendMail({
            to: email,
            from: 'brenner.batista@outlook.com',
            template: 'auth/forgot_password',
            context: { token }, //passando a variavel token
        }, (err) => {
            if (err)
                return res.status(400).send({ error: 'Cannot send forgot password email' });
        });
        return res.status(200).send({ success: "Email enviado com sucesso!" });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro on forgot password, try again" });
    }
})

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;
    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');

        if (!user)
            return res.status(404).send({ error: "User not found" });
        if (token !== user.passwordResetToken)
            return res.status(401).send({ error: 'Token invalid' });

        const now = new Date();

        if (now > user.passwordResetExpires)
            return res.status(401).send({ error: 'Token expired, generate a new one' });

        user.password = password;

        await user.save();
        res.send();

    } catch (err) {
        res.status(500).send({ error: 'Cannot reset password, try again' });
    }

});

module.exports = app => app.use('/auth', router) //recebo app e a url = auth/register ou /auth/qualquercoisa