let net = require('net');

let commandHandler = require('./commandHandler');
let utils = require('./utils');

let clients = {};

net.createServer(socket => {
    // prompt user to set a nickname
    socket.write("Welcome to the chat!\n");
    
    // initially set socket nickname to ip:port
    socket.nickName = socket.remoteAddress + ':' + socket.remotePort;

    // push client to the clientsMap
    clients[socket.nickName] = socket;
    
    // broadcast new connection
    utils.broadcast(socket.nickName + " joined the chat.\n", socket, clients);

    let text;
    // handle incoming data
    socket.on('data', message => {
        text = message.toString('utf8');
        text = text.trim();
        // check if client is trying to execute a command
        if (text[0] == '/') {
           clients = commandHandler(text.substring(1, text.length), socket, clients);
        }
        else {
            // if no command is being executed, broadcast message
            utils.broadcast(socket.nickName + "> " + message, socket, clients);
        }
    });

    // remove socket from clients when connection ends
    socket.on('end', () => {
        broadcast(socket.nickName + ' left the chat.\n', null, clients);
        delete clients[socket.nickName];
    });

}).listen(5000);

console.log('chat server listening on localhost:5000');