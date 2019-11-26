const express = require("express");
const authMiddleware = require("../middlewares/auth");

const Message = require('../models/Message')
const User = require('../models/User');

const router = express.Router();

router.use(authMiddleware); //verificara o token primeiro


router.post('/', async (req, res) => {
    try {
        var userToId = req.query.userToId;
        var userTo = [];
        try {
            userTo = await User.findById(userToId); 
        }
        catch{
            return res.status(404).send({ error: 'User "to" not found' });
        }
        const _id = req.userId;
        if (userTo._id == _id)
            return res.status(409).send({ error: 'You are not allowed to send a message to yourself!' });

        const user = await User.findOne({ _id });
        const message = req.body.message;
        const messages = await Message.create({ author: user.name, message, id_user: _id, id_user_to: userTo._id }); //req.userid é preenchido na verificação do token

        return res.send({
            message: messages,
        });

    } catch (err) {
        return res.status(400).send({ error: 'Registration message failed' });
    }
});

router.get('/', async (req, res) => {
    try {
        const messages = await Message.find();
        return res.send({ messages });

    } catch (err) {
        return res.status(500).send({ error: 'Error get all messages' });
    }
});


router.get('/:userReceived', async (req, res) => { //buscar mensagens recebidas por aquele usuário
    try {
        var userR = [];
        try {
            userR = await User.findById(req.params.userReceived); 
        }
        catch{
            return res.status(404).send({ error: 'User not found' });
        }

        const messages = await Message.find({id_user_to : userR});

        return res.send({
            messages
        });

    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed' });
    }
});




module.exports = app => app.use('/message', router);
