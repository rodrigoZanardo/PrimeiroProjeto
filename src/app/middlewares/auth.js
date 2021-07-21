const jwt = require("jsonwebtoken");
const authConfig = require('../../Config/auth.json');



module.exports = (req, res, next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({ error: 'no token provided'});
    }

    const parts = authHeader.split(' ');

    if(!parts.length ===2){
        return res.status(401).send({ error:'Token Error'});
    };

    const[ schema, token] = parts;


    if(!/^Bearer$/i.test(schema)){
        
        return res.status(401).send({ error: 'token malformateed'});
    };

   jwt.verify(token, authConfig.secret, (err, decoded) =>{
       if(err) return res.status(401).send({ error: 'token invalid'});

       req.userId = decoded.id;
       return next();
   });

};