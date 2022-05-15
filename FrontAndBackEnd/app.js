var dir = "/client/templates"
const { setDefaultResultOrder } = require('dns');

require('./server/entity')

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

serv.listen(8000);
console.log("server started.");

var SOCKET_LIST = {};
var PLAYER_LIST = {};



var io = require('socket.io') (serv, {});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    Player.onConnect(socket);

    socket.on('disconnect', function() {
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });
});

setInterval(function(){
    var pack = Player.update();
    

    for (var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('newPositions', pack);
    }
    
}, 1000/120);