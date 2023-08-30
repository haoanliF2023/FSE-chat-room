var socket = io();

var form = document.getElementById('chat-form');
var input = document.getElementById('input');

function elementFromHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', {
            user_id: user.id, 
            username: user.username,
            message: input.value,
            time: new Date().toLocaleString(),
        });
        input.value = '';
    }
});

socket.on('chat message', function(msg) {
    var messageElement = elementFromHtml(`
        <div class="message">
            <h4>${msg.username}</h4>
            <p class="time">${msg.time}</p>
            <p>${msg.message}</p>
        </div>
    `);
    messages.appendChild(messageElement);
    window.scrollTo(0, document.body.scrollHeight);
});
  