var dir = "/client/templates"
var express = require('express');
var app = express();
var serv = require('http').Server(app);

const urlencodedParser = express.urlencoded({extended: false});

app.get('/', function(req, res) {
    res.sendFile(__dirname + dir + '/main/index.html');
});

app.post("/", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.send(`${request.body.userName} - ${request.body.userAge}`);
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log("server started.");

var io = require('socket.io') (serv, {});
io.sockets.on('connection', function(socket){
    console.log('socket connect');

    socket.on('happy', function(data){
        console.log('happy ' + data.id);
    });

    socket.emit('serverMsg', {
        msg:'hello',
    });



});