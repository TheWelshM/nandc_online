
var express = require('express');
var socket = require('socket.io');

var PORT = process.env.PORT || 3000;

var app = express();


var server = app.listen(PORT);

let clientNo = 0;

const clientRooms = {};
const states = {};

app.use(express.static('../public'));

//Socket Setup 
var io = socket(server);

io.on('connection', (socket)=> {
     console.log("New Socket connection: " + socket.id);
    
    
    socket.on('newGame',handleNewGame);
    socket.on('joinGame',handleJoinGame);
    socket.on('move', getCurrentTracker);
    
    function getCurrentTracker(clientObj){
        console.log(clientObj.roomName);
        console.log(clientObj.data);
//send data out to people in room         
 io.to(clientObj.roomName).emit('sendData',clientObj.data);
        states[clientObj.roomName] = clientObj.data;
        console.log(states);
        
    }
    
    function handleNewGame(){
        let roomName = makeid(5);
        //clientRooms[socket.id] = roomName;
        socket.emit('gameCode',roomName);
        socket.join(roomName);
        socket.emit('serverMsg', roomName);
        socket.emit('init',1);
        
        //add room to rooms object
        clientRooms[socket.id] = roomName;
        console.log(clientRooms);
    }
    
    function handleJoinGame(gameCode){
        socket.join(gameCode);
        
        clientRooms[socket.id] = gameCode;
        console.log(clientRooms);
        
        socket.emit('serverMsg', gameCode);
        socket.emit('init',2);
        
        //send data to all rooms to start play
        //io.to(clientObj.roomName).emit('sendData',clientObj.data);
        io.to(clientRooms[socket.id]).emit('startGame');
    }
    
    //reset room data when received the resset game button
    socket.on('resetGame',handleResetGame);
    
    function handleResetGame(){
        console.log("reset data in server please");
        states[clientRooms[socket.id]] = [
        ['','',''],
        ['','',''],
        ['','','']
    ];
    io.to(clientRooms[socket.id]).emit('sendData',states[clientRooms[socket.id]]);
        console.log(states); 
    }
});


function makeid(length){
    var result = '';
    var characters = "ABCDEFGHIJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuwxyz0123456789";
    var charLength = characters.length;
    for(var i=0; i<length; i++){
        result += characters.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}



/*var express = require("express");
var socket = require('socket.io');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("server is running...");

var io = socket(server);

io.sockets.on('connection', newConnection);


const clientRooms = {};
const state = {};


function newConnection(socket){
    console.log("new connection" + socket.id);
    
    socket.on('move', moveMsg);
    
    function moveMsg(data){
        socket.broadcast.emit('move',data);
        console.log(data);
    }
    
    
    socket.on('newGame', handleNewGame);
    
    function handleNewGame(){
        let roomName = makeid(5);
        console.log("handle new game please");
        clientRooms[socket.id] = roomName;
        socket.emit('gameCode', roomName);
        
        state[roomName] = createGameState();
        
        socket.join[roomName];
        //socket.number = 1;
        
        
    }
}

function createGameState(){
    return data; 
}

function makeid(length){
    var result = '';
    var characters = "ABCDEFGHIJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuwxyz0123456789";
    var charLength = characters.length;
    for(var i=0; i<length; i++){
        result += characters.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}*/