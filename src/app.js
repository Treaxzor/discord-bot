const express = require('express');
const session = require('express-session');
const path = require('path');
const config = require('config');
const bodyParser = require('body-parser');
const { migrate } = require("./db");
const { middlewares: passport } = require('./auth');
const router = require('./router');

require('./listeners/discord');

migrate().then(() => {
  const server = express();
  // security
  server.disable('x-powered-by');

  // static files
  server.use("/bootstrap", express.static(path.resolve(__dirname + '/../node_modules/bootstrap/dist')));
  server.use("/jquery", express.static(path.resolve(__dirname + '/../node_modules/jquery/dist')));
  server.use("/table", express.static(path.resolve(__dirname + '/../node_modules/bootstrap-table/dist')));
  server.use("/", express.static(path.resolve(`${__dirname}/../public`)));

  // session
  server.use(session({
    name: 'iknkffx', secret: config.authentication.session.secret, cookie: { maxAge: 1200000 }, rolling: true,
  }));

  // passport
  server.use(passport);

  // plugins
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({
    extended: true,
  }));

  server.use("/", router);
  server.listen(5000);

  console.log("service listening on port 5000");

});

