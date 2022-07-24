// var $ = require('./jquery.js')
// import * as $ from './jquery.js'
var socket = new WebSocket('ws://localhost:8181/', 'chat');
var name = 'u1'


socket.onopen = function () {
    
    name = "name" + Math.floor(Math.random() * Math.floor(700));

    socket.send('{"type": "join", "name":" '+name+'"}');
}


$('.send_message').on('click', function (e) {
    e.preventDefault();
    msg = $('.message_input_wrapper input').val();
    socket.send('{"type": "msg", "msg": "' + msg + '"}');
    $('.message_input_wrapper input').val('');
});


socket.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    switch (data.type) {
        case 'msg':
            var msg = $('<li>' + data.name + ': ' + data.msg +
                    '</li>');
            $('.messages').append(msg);
            break;
        case 'join':
            $('#users').empty();
            for (var i = 0; i < data.names.length; i++) {
                var user = $('<div>' + data.names[i] + '</div>');
                $('#users').append(user);
            }
            break;
    }
};
