const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

//nesse arquivo vamos verificar a validação do token ( se esta no tempo de expirar, se é um token da nossa aplicação, etc ... )

module.exports = (req, res, next) => { //next = chama ele soente se o usuario está ápito a ir para o proximo passo
    const authHeader = req.headers.authorization;
    //Fazendo verificações rápidas primero
    if (!authHeader)
        return res.status(401).send({ error: 'No token provided' });

    if (authHeader == "master"){
        req.userId = "5d3a0c50954f933c8c98b817"; //por enquanto manter esse id como master
        //req.userId = "5d23dbd3ee40ae0d98220b43"; //por enquanto manter esse id como master
        return next();
    }
    //Formato de um token => Bearer + Hash ( vavniasdasidnasidnasdni aleatório)
    const parts = authHeader.split(' ');
    if (!parts.lenght === 2)
        return res.status(401).send({ error: 'Token error' });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) //verificando se tem a palavra Bearer
        return res.status(401).send({ error: 'Token malformatted' });

    //Verificação mais demorada ( verificar se o token pertence ao usuário)

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token inválido' }); //verifica até o tempo de duração dele.

        req.userId = decoded.id; //pois montei o token com o user.id
        return next();
    })
};