
const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer.js')
const path = require('path');

const authConfig = require('../../Config/auth.json');

const router = express.Router();

function generateToKen(params = {}){
    return jwt.sign(  params , authConfig.secret,{
        expiresIn:86400,
    });
};

router.post('/register', async(req , res)=>{
const{ email } = req.body;

    try{
        if (await User.findOne({email})){
            return res.status(500).send({error: 'ja tem este e mail'});
        };
        
        const user = await User.create(req.body);
        const token = jwt.sign({  id: user.id }, authConfig.secret,{
            expiresIn:86400,
        });

        user.password = undefined;

        return res.send({ 
            user, 
            token: generateToKen({ id: user.id }),
        });

    }catch(err){
       return res.status(500).send({error: 'deu erro aqui'});
    }
    });

router.post('/autenticacao', async(req , res) =>{
    const{ email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user){
        return res.status(400).send({error: 'nao achou o usuario'});
    }
    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({error: 'senha errada'});
    }

    user.password = undefined;

    const token = jwt.sign({  id: user.id }, authConfig.secret,{
        expiresIn:86400,
    });

    res.send({ 
        user, 
        token: generateToKen({ id: user.id })
    });

});


router.post('/forgot_password', async(req , res) =>{
    const{ email } = req.body;
    
    try{
        const user = await User.findOne({ email });
        if (!user){
            return res.status(400).send({error: 'nao achou o usuario'});
        }
     
        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours()+1);

        await User.findOneAndUpdate(user.id,{
            '$set':{
                passwordResetToken: token,
                passwordResetExpires:now,
            }
        });

        mailer.sendMail({
            to: email,
            from:'rzanardo1@gmail.com',
            template:'forgot_password',
            context: { token } ,
        },(err, result) =>{
            if(err){ 
                console.log(err);
                return res.status(400).send({error: 'cannot send token'});
            }
            console.log(result)
            return res.status(200).send('okk'); 
        })

    }catch(err){
        console.log(err)
        res.status(400).send({error: 'erro on forgot passawod, try again'});
    }
});

router.post('/reset_password', async(req,res) =>{
const { email, token, password} = req.body;
    try{
        const user = await User.findOne({email})
        .select('passwordResetToken passwordResetExpires');
     
        
        if (!user){
            return res.status(400).send({error: 'nao achou o usuario'});
        }
        console.log(token);
        console.log(user.passwordResetToken);

        if(token !== user.passwordResetToken){
            return res.status(400).send({error: 'Token Invalid'});
        }

        const now  = new Date();
        
        if(now > user. passwordResetExpires){
            return res.status(400).send({error: 'Token expirado'});
        }

        user.password = password;
        await user.save();
        res.send();

    }catch(err){
        res.status(400).send({error: 'erro on forgot passawod, try again'});
    }
});

module.exports = app => app.use('/auth',router);