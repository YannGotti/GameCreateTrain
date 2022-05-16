//login

var signDiv = document.getElementById('signDiv');
var signDivCode = document.getElementById('signDiv-code');
var signDivSignIn = document.getElementById('signDiv-signIn');

signDivSignIn.onclick = function() {
    socket.emit('signIn', {code:signDivCode.value});
}


socket.on('signInResponse', function(data) {
    if(data.success){
        signDiv.style.display = 'none';
        gameDiv.style.display = 'block';
    }else
        alert("Не авторизован дебил");
});

