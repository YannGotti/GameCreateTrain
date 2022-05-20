
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
//const WINDOW_WIDTH = window.screen.width;
//const WINDOW_HEIGHT = window.screen.height;
var c = document.getElementById('ctx');
var ctx = c.getContext("2d");
ctx.font = '30px Arial';
//c.height = WINDOW_HEIGHT;
//c.width = WINDOW_WIDTH;


var Player = function(initPack) {
    var self = {};
    self.id = initPack.id;
    self.number = initPack.number;
    self.username = initPack.username;
    self.x = initPack.x;
    self.y = initPack.y;
    self.hp = initPack.hp;
    self.hpMax = initPack.hpMax;
    self.score = initPack.score;


    self.draw = function() {
        var hpWidth = 30 * self.hp / self.hpMax;
        ctx.fillRect(self.x - hpWidth/2, self.y - 40, hpWidth, 4);
        ctx.fillText(self.username, self.x, self.y);

        ctx.fillText(self.score, self.x, self.y - 60);
    }

    Player.list[self.id] = self;
    return self;
}
Player.list = {};


var Bullet = function(initPack) {
    var self = {};
    self.id = initPack.id;
    self.x = initPack.x;
    self.y = initPack.y;

    self.draw = function() {
        ctx.fillRect(self.x - 5, self.y - 5, 10, 10);
    }

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
            if(pack.hp !== undefined)
                p.hp = pack.hp;    
            if(pack.score !== undefined)
                p.score = pack.score;
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
        Player.list[i].draw();
    for(var i in Bullet.list)
        Bullet.list[i].draw();
}, 1);


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