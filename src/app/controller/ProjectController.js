const express =require('express');

const authMiddleware = require('../middlewares/auth.js')

const router = express.Router();

router.use(authMiddleware);

router.get('/',(req,res) => {
    res.send({
        'OK': true,
        'User': req.userId
});
});

module.exports = app => app.use('/projects',router);