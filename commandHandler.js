let utils = require('./utils');

function setNick(newNick, socket, clients) {
    let currentNick = socket.nickName;

    // change nickName of client
    if (clients[newNick] == null) {
        socket.nickName = newNick;
        clients[newNick] = socket;
        delete clients[currentNick];
        utils.broadcast(currentNick + ' changed their nickname to ' + newNick + '\n', socket, clients);
        socket.write('Nickname changed to ' + newNick + '\n');
    }
    else {
        socket.write('Nickname ' + newNick + ' is already taken.\n');
    }

    return clients;
}

module.exports = function commandHandler(commandString, socket, clients) {
    command = commandString.split(' ');
    if (command.length == 2) {
        switch (command[0]) {
            case 'setnick': return setNick(command[1], socket, clients);
                            break;
            default:        socket.write('Unknown command ' + command[0] + '\n');
                            break;
        }
    }
    else {
        socket.write('Invalid arguments for ' + command[0] + '\n');
    }
    return clients;
}