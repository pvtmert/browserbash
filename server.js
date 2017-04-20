const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const spawn = require('child_process').spawn;
const sh = spawn('bash');

app.use("/" ,express.static(require("path").dirname(module.filename), { index:"index.htm" }))

sh.stdout.on('data', function(data) {
  io.emit('message', data);
});

sh.stderr.on('data', function(data) {
  io.emit('message', data);
});

sh.on('exit', function (code) {
  io.emit('exit', '** Shell exited: '+code+' **');
});

io.on('connection', function(client){
  client.on('message', function(data){
    sh.stdin.write(data+"\n");
    io.emit('message', new Buffer("> "+data));
  });
});

server.listen((process.argv.length < 3)?8080:process.argv[2], function(){
  console.log('server started', process.argv);
})
