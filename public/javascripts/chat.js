var socket = io();

var form = document.getElementById('chat-form');
var input = document.getElementById('input');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', {
            user: user, 
            message: input.value
        });
        input.value = '';
    }
});

socket.on('chat message', function(msg) {
    var item = document.createElement('p');
    item.textContent = msg.message;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});
  