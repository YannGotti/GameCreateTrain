
console.log(window.screen.height + ":" + window.screen.width);

var socket = io();

var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');
gameDiv = document.getElementById('gameDiv');





//chat
socket.on('addToChat', function(data) {
    chatText.innerHTML += '<div>' + data + '</div>';
});

socket.on('evalAnswer', function(data) {
    console.log(data);
});


chatForm.onsubmit = function(e) {
    e.preventDefault();
    if(chatInput.value[0] === '/')
        socket.emit('evalServer' , chatInput.value.slice(1));
    else
        socket.emit('sendMsgToServer' , chatInput.value);
    chatInput.value = '';
}


//game

var ctx = document.getElementById('ctx').getContext("2d");
ctx.font = '30px Arial';

var Player = function(initPack) {
    var self = {};
    self.id = initPack.id;
    self.number = initPack.number;
    self.username = initPack.username;
    self.x = initPack.x;
    self.y = initPack.y;
    Player.list[self.id] = self;
    console.log(initPack);
    return self;
}
Player.list = {};


var Bullet = function(initPack) {
    var self = {};
    self.id = initPack.id;
    self.x = initPack.x;
    self.y = initPack.y;
    Bullet.list[self.id] = self;
    return self;
}
Bullet.list = {};

//init

socket.on('init', function(data) {
    for(var i = 0; i < data.player.length; i++){
        new Player(data.player[i]);
    }
    for(var i = 0; i < data.bullet.length; i++){
        new Bullet(data.bullet[i]);
    }
});

//update

socket.on('update', function(data) {
    for(var i = 0; i < data.player.length; i++){
        var pack = data.player[i];
        var p = Player.list[pack.id];
        if(p) {
            if(pack.x !== undefined)
                p.x = pack.x;
            if(pack.y !== undefined)
                p.y = pack.y;
        }
    }

    for(var i = 0; i < data.bullet.length; i++){
        var pack = data.bullet[i];
        var b = Bullet.list[data.bullet[i].id];
        if(b) {
            if(pack.x !== undefined)
                b.x = pack.x;
            if(pack.y !== undefined)
                b.y = pack.y;
        }
    }
});

//remove

socket.on('remove', function(data) {
    for(var i = 0; i < data.player.length; i++) {
        delete Player.list[data.player[i]];
    }

    for(var i = 0; i < data.bullet.length; i++) {
        delete Bullet.list[data.bullet[i]];
    }
});

setInterval(function() {
    ctx.clearRect(0, 0, 500, 500);
    for(var i in Player.list)
        ctx.fillText(Player.list[i].username, Player.list[i].x, Player.list[i].y);

    for(var i in Bullet.list)
        ctx.fillRect(Bullet.list[i].x - 5, Bullet.list[i].y - 5, 10, 10);
}, 40);


document.onkeydown = function(event) {
    if(event.keyCode  === 68) //d
        socket.emit('keyPress', {inputId:'right', state:true});
    else if(event.keyCode  === 83) //s
        socket.emit('keyPress', {inputId:'down', state:true});
    else if(event.keyCode  === 65) //a
        socket.emit('keyPress', {inputId:'left', state:true});
    else if(event.keyCode  === 87) //w
        socket.emit('keyPress', {inputId:'up', state:true});
};

document.onkeyup = function(event) {

    if(event.keyCode  === 68) //d
        socket.emit('keyPress', {inputId:'right', state:false});
    else if(event.keyCode  === 83) //s
        socket.emit('keyPress', {inputId:'down', state:false});
    else if(event.keyCode  === 65) //a
        socket.emit('keyPress', {inputId:'left', state:false});
    else if(event.keyCode  === 87) //w
        socket.emit('keyPress', {inputId:'up', state:false});
};


document.onmousedown = function(event) {
    socket.emit('keyPress', {inputId:'attack', state:true});
};

document.onmouseup = function(event) {
    socket.emit('keyPress', {inputId:'attack', state:false});
};

document.onmousemove = function(event) {
    var x = -250 + event.clientX - 8;
    var y = -250 + event.clientY - 8;
    var angle = Math.atan2(y,x) / Math.PI * 180;
    socket.emit('keyPress', {inputId:'mouseAngle', state:angle});

};