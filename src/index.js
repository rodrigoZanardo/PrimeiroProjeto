const  express = require('express');
const bodyparser = require('body-parser');
const mongoDb = require('./db');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false}));

mongoDb();

require('./app/controller/index')(app);
//require('./app/controller/authController.js')(app);
//require('./app/controller/ProjectController.js')(app);

app.get('/',(req,res) =>{res.send("ok")});

console.log('Tudo Certo');
app.listen(3000);
