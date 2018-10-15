# Node Chat

A simple chat server built in node.js. It has the following features:

* Connect multiple clients
* Clients can talk on the server
* Clients can set and change their nicknames

## To run the server

Clone the repo with

```bash
git clone https://github.com/faraazahmad/node-chat
```

and `cd` into it.
Then simply run the server _(you must have NodeJS installed)_ using

```bash
node server.js
```

## To connect to a chat server

You can `telnet` into it using

```bash
telnet <SERVER_IP> 5000
```

where `<SERVER_IP>` is the IPv4 address of the chat server, for example `192.168.0.114`.