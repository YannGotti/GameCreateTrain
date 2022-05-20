const { sendfile } = require("express/lib/response");

Entity = function() {
    var self = {
        x:250,
        y:250,
        spdX:0,
        id:"",
    }

    self.update = function() {
        self.updatePosition();
    }

    self.updatePosition = function() {
        self.x += self.spdX;
    }

    self.getDistance = function(pt) {
        return Math.sqrt(Math.pow(self.x-pt.x, 2));
    }

    return self;

};

Player = function(id, code) {
    var self = Entity();

    self.id = id;
    self.number = "" + Math.floor(10 * Math.random());
    self.pressingRight = false;
    self.pressingLeft = false;
    self.pressingAttack = false;
    self.mouseAngle = 0;
    self.maxSpd = 10;
    self.hp = 10;
    self.hpMax = 10;
    self.score = 0;

    isSelectUsername(code, function(res){
        self.username = res;
    });

    var super_update = self.update;
    self.update = function() {
        self.updateSpd();
        super_update();

        if(self.pressingAttack) {
            self.shootBullet(self.mouseAngle);
        }
    }

    self.shootBullet = function(angle) {
        var b = Bullet(self.id, angle);
        b.x = self.x;
    }



    self.updateSpd = function() {
        if(self.pressingRight)
            self.spdX = self.maxSpd;
        else if (self.pressingLeft)
            self.spdX = -self.maxSpd;
        else
            self.spdX = 0;
        //if(self.pressingUp)
        //    self.spdY = -self.maxSpd;
        //else if (self.pressingDown)
        //    self.spdY = self.maxSpd;
        //else
        //    self.spdY = 0;
    }

    self.getInitPack = function() {
        return {
            id:self.id,
            x:self.x,
            y:self.y,
            number:self.number,
            username:self.username,
            hp:self.hp,
            hpMax:self.hpMax,
            score:self.score,
        };
    }

    self.getUpdatePack = function() {
        return {
            id:self.id,
            x:self.x,
            hp:self.hp,
            score:self.score,
        };
    }


    Player.list[id] = self;
    
    setTimeout(function() {
        initPack.player.push(self.getInitPack());
    }, 5);
    

    return self;
}

Player.list = {};
Player.onConnect = function(socket, code) {
    var player = Player(socket.id, code);

    socket.on('keyPress', function(data) {
        if(data.inputId === 'left')
            player.pressingLeft = data.state;
        else if(data.inputId === 'right')
            player.pressingRight = data.state;
        //else if(data.inputId === 'up')
        //    player.pressingUp = data.state;
        //else if(data.inputId === 'down')
        //    player.pressingDown = data.state;
        else if(data.inputId === 'attack')
            player.pressingAttack = data.state;
        else if(data.inputId === 'mouseAngle')
            player.mouseAngle = data.state;
    });

    socket.emit('init', {
        player:Player.getAllInitPack(),
        bullet:Bullet.getAllInitPack(),
    });
}

Player.getAllInitPack = function(){
    var players = [];
    for(var i in Player.list)
        players.push(Player.list[i].getInitPack())
    return players;
}

Player.onDisconnect = function(socket) {
    delete Player.list[socket.id];
    removePack.player.push(socket.id);
}

Player.update = function() {
    var pack = [];
    for(var i in Player.list){
        var player = Player.list[i];
        player.update();
        pack.push(player.getUpdatePack());
    }
    return pack;
}

Bullet = function(parent, angle) {
    var self = Entity();
    self.id = Math.random();
    self.spdX = Math.cos(angle/180*Math.PI) * 10;
    self.parent = parent;

    self.timer = 0;
    self.toRemove = false;
    var super_update = self.update;
    self.update = function() {
        if(self.timer++ > 100)
            sendfile.toRemove = true;
        super_update();

        for(var i in Player.list) {
            var p = Player.list[i];
            if(self.getDistance(p) < 32 && self.parent !== p.id) {
                // Обработка состояния игрока
                p.hp -= 1;
                if(p.hp <= 0){
                    var shooter = Player.list[self.parent];
                    if(shooter)
                        shooter.score += 1;
                    p.hp = p.hpMax;
                    p.x = Math.random() * 500;
                    p.y = 250;
                }

                self.toRemove = true;
            }

        }
    }

    self.getInitPack = function() {
        return {
            id:self.id,
            x:self.x,
            y:self.y
        };
    }

    self.getUpdatePack = function() {
        return {
            id:self.id,
            x:self.x,
        };
    }


    Bullet.list[self.id] = self;
    initPack.bullet.push(self.getInitPack());

    return self;
}

Bullet.list = {};

Bullet.update = function() {
    

    var pack = [];
    for(var i in Bullet.list){
        var bullet = Bullet.list[i];
        bullet.update();
        if(bullet.toRemove){
            delete Bullet.list[i];
            removePack.bullet.push(bullet.id);
        }
        else
            pack.push(bullet.getUpdatePack());
    }
    return pack;
}

Bullet.getAllInitPack = function(){
    var bullets = [];
    for(var i in Bullet.list)
        bullets.push(Bullet.list[i].getInitPack());
    return bullets;
}


var initPack = {player:[], bullet:[]};
var removePack = {player:[], bullet:[]};


setInterval(function(){
    var pack = {
        player:Player.update(),
        bullet:Bullet.update(),
    }

    for (var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('init', initPack);
        socket.emit('update', pack);
        socket.emit('remove', removePack);
    }

    initPack.player = [];
    initPack.bullet = [];
    removePack.player = [];
    removePack.bullet = [];
    
}, 1000/60);
