var dir = "/client/templates"
const { setDefaultResultOrder } = require('dns');

require('./server/entity')
require('./server/mongo')


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

SOCKET_LIST = {};
PLAYER_LIST = {
};


var DEBUG = true;

var io = require('socket.io') (serv, {});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    socket.on('signIn', function(data){
        isValidPassword(data, function(res){
            if(res) {
                Player.onConnect(socket, data.code);
                socket.emit('signInResponse', {success:true});
            } else {
                socket.emit('signInResponse', {success:false});
            }
        });
    });


    socket.on('disconnect', function() {
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
    });

    socket.on('sendMsgToServer', function(data) {
        var playerName = ("" + socket.id).slice(2,7);
        for(var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', playerName + ": " + data);
        }
    });

    socket.on('evalServer', function(data) {
        if(!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer', res);
    });

    
});