let net = require('net');
let StringDecoder = require('string_decoder').StringDecoder;

let clients = [];
let nickname;
let decoder = new StringDecoder('utf8');

function checkAvailability(nick) {
    clients.forEach(client => {
        if (client.nickname == nick) {
            return false;
        }
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

    let text;
    // handle incoming data
    socket.on('data', message => {
        text = message.toString('utf8');
        text = text.trim();
        text = text.split(' ');
        // check if client is trying to change their nickname
        if (text[0] == 'setnick') {
            nickname = text[1];
            // check if nickname is availabke
            if (checkAvailability(nickname)) {
                let old = socket.nickname;
                // change client's nickname
                clients[clients.indexOf(socket)].nickname = nickname;
                socket.nickname = nickname;
                // broadcast nickname change
                broadcast(old + ' changed their nickname to ' + nickname + '\n', socket);
                socket.write('Nickname changed to ' + nickname + '.\n')
            }
            else {
                socket.write('Nickname ' + nickname + ' not available.\n')
            }
        }
        else {
            // if not a nickname change simply boradcast message
            broadcast(socket.nickname + "> " + message, socket);
        }
    });

    // remove from clients when connection ends
    socket.on('end', () => {
        clients.splice(clients.indexOf(socket), 1);
        broadcast(socket.nickname + ' left the chat.');
    });

}).listen(5000);

console.log('chat server listening on localhost:5000');