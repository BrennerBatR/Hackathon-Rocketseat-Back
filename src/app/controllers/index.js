const fs = require('fs');
const path = require('path');

module.exports = app => {
    fs
        .readdirSync(__dirname)
        .filter(file => ((file.indexOf('.')) !== 0 && (file !== "index.js")))// nao começam com ponto e nao sao index.js
        .forEach(file => require ( path.resolve(__dirname , file ))(app)); //estou importando todos arquivos de controllers no projeto de rotas
}