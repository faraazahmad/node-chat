let net = require('net');

let clients = [];
let nickname;

function checkAvailability(nick) {
    clients.forEach(client => {
        if (client.nickname == nick)
            return false;
    });

    return true;
}

function broadcast(message, sender) {
    clients.forEach(client => {
        if (client == sender) return;
        client.write(message);
    });

    // log message to the server
    process.stdout.write(message);
}

net.createServer(socket => {
    // prompt user to set a nickname
    socket.write("Welcome to the chat!\n");
    
    // initially set socket nickname to ip:port
    socket.nickname = socket.remoteAddress + ':' + socket.remotePort;
    
    // broadcast new connection
    broadcast(socket.nickname + " joined the chat.\n", socket);

    // push socket to list of clients
    clients.push(socket);

    // handle incoming data
    socket.on('data', message => {
        broadcast(socket.nickname + "> " + message, socket);
    });

    // remove from clients when connection ends
    socket.on('end', () => {
        clients.splice(clients.indexOf(socket), 1);
        broadcast(socket.nickname + ' left the chat.');
    });

}).listen(5000);

console.log('chat server listening on localhost:5000');