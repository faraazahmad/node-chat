module.exports = {

    broadcast: function (message, sender, clients) {
        for (let nickName in clients) {
            if (nickName != sender.nickName) {
                clients[nickName].write(message);
            }
        }

        // log message to the server
        process.stdout.write(message);
    }

};