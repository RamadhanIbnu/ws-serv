const webSocketServerPort = 8010;
const webSocketServer = require('websocket').server;
const http = require('http');

// Spinning the http serverand the websocket server.
const server = http.createServer();
server.listen(webSocketServerPort);
console.log(`listening on port ${webSocketServerPort}`);

const wsServer = new webSocketServer({
    httpServer: server
})

const clients = {};

//This code generates unique userid for every user
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
  };

wsServer.on('request', (request)=>{
    var userID = getUniqueID();
    console.log(`${(new Date)} Recieved a new connection from origin ${request.origin}.`);

    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log(`connected: ${userID} in ${Object.getOwnPropertyNames(clients)}`);

    connection.on('message', (message)=>{
        if (message.type === 'utf8'){
            console.log(`Received message: ${message.utf8Data}`);

            // broadcasting message to all connected clients
            for (key in clients){
                clients[key].sendUTF(message.utf8Data);
                console.log(`Send message to: ${clients[key]}`)
            }
        }
    })
})