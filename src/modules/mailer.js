const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const {host,port,user,pass} = require('../Config/mail.json');

var transport = nodemailer.createTransport({
    host,
    port,
    auth: { user,pass},
  });

  transport.use('compile', hbs({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve(__dirname,'../app/resources/mail/auth'),
    },
    viewPath: path.resolve(__dirname,'../app/resources/mail/auth'),
    extName: '.html',
  }));



  module.exports = transport;