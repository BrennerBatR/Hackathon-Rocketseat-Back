const express = require('express');
const path = require('path');

//configuração de http e websocket
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
  res.render('index.html');
});

const request = require('request');
const hostname = 'http://localhost:3000/message';

io.on('connection', socket => {
  // console.log(`Socket conectado: ${socket.id}`);
  let token = socket.handshake.query.token;
 

  //quando conectar tenho que puxar as mensagens antigas
  request({
    headers: {
      'Authorization': token
    },
    uri: hostname,
    method: 'GET'
  }, (error, res, body) => {
    if (error) {
      return res.status(500).send({ error: 'Error get all messages' });
    } else {
      var messages = JSON.parse(body);
      socket.emit('previousMessages', messages.messages); //enviar as mensagens anteriores so para o usuario q conectou no momento
    }
  });
  socket.on('sendMessage', data => { //data = mensagem on = ouvir emit = enviar 
    //socket.broadcast.emit('receivedMessage', data); //braodcast envia para todos q estao conectados na aplicção
    request({
      headers: {
        'Authorization': token
      },
      uri: hostname + "?userToId=" +socket.handshake.query.userToId ,
      form: { "author": data.author, "message": data.message },
      method: 'POST'
    }, (error, res, body) => {
      if (error) {
        return
      } else {
        var message = JSON.parse(body);
        if (message['error'] != null) {
          console.error(message['error']);
          return
        }
        io.emit('receivedMessage', message.message); // io.emit = broadcast
      }
      //console.log(`statusCode: ${res.statusCode}`)
    });

  });
});






server.listen(3001);