
console.log(window.screen.height + ":" + window.screen.width);

var socket = io();


var b = document.getElementById('button');
var random = Math.random();


b.onclick = function() {
    socket.emit('happy', {
        reason: 'yyy',
        id: random
    }); 
};


socket.on('serverMsg', function(data){
    console.log(data.msg);
});