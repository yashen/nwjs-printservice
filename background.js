var config = require("./config").default
var winston = require('winston');
var ws = require("nodejs-websocket");
winston.add(winston.transports.File, { filename: 'background.log' });
var restify = require('restify');

var tasks = []

var server = restify.createServer();
server.use(restify.bodyParser());
server.post("/print/:name", function (req, res, next) {
  let name = req.params.name;
  var data = req.body;
  tasks.push({
    Name: name,
    Data: data
  });
  res.send("OK")
  next();
});

console.log(config);

server.listen(config.port, function () {
  winston.info('PrintService listening at %s', server.url);
});

ws.createServer(function (conn) {
  winston.info("Websocket client connected");
  clientConn = conn;
  conn.on("text", function (str) {
    if (str == "get") {
      var task = tasks.shift()
      if (task) {
        conn.sendText(JSON.stringify(task));
      }
    }
  })
  conn.on("error",function(){
  });
  conn.on("close", function (code, reason) {
    clientConn = null;
    console.log("Connection closed")
  })
}).listen(config["websocket-port"], function () {
	console.log("Websocket Service started");
});
