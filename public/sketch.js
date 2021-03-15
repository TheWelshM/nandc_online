var boardX;
var boardY;

var boardXSize;
var boardYSize;

var boardSpace;

var squares = [];


var nought;
var cross;
var blank;

var blankButs = [];

var clicked;

var currentShape;

var crossBut;
var noughtBut;

var players = 0; 

let clientRoom;

var clientData = {
    roomName: "",
    data: [
        ['','',''],
        ['','',''],
        ['','','']
    ]
}; 

const socket = io.connect('http://localhost:3000');

socket.on('serverMsg', (data) => {
   console.log(`I am in room No. ${data}`);
    clientData.roomName = data; 
});



 

var startGame = false; 

var startBut = document.getElementById("start-game");
const newGameBut = document.getElementById("newGameButton");
const joinGameBut = document.getElementById("joinGameButton");
const gameCodeInput = document.getElementById("gameCodeInput");
var gameCodeDisplay = document.getElementById("gameCodeDisplay");
var playerShape = document.getElementById("playerShape");
var resetBut = document.getElementById("resetButton");

newGameBut.addEventListener('click', newGame);
joinGameBut.addEventListener('click', joinGame);
resetBut.addEventListener('click', resetGame)


function newGame(){
    //socket.emit('newGame'); 
    socket.emit('newGame');
    //startGame = true;
    //loop();
    //socket.emit('newGame');
    //hide game input screen. 
    
}

function joinGame(){
    //console.log("Join a game");
    const code = gameCodeInput.value;
    socket.emit('joinGame',code);
    //startGame = true;
    //loop();
}

socket.on('gameCode', handleGameCode);

function handleGameCode(gameCode){
    gameCodeDisplay.innerText = gameCode;
}


socket.on('sendData', recieveData);

function recieveData(dataIn){
    clientData.data = dataIn;    
}

socket.on('startGame', goGame);

function goGame(){
    console.log("All players are in so lets start the game");
    startGame = true; 
    loop();
}


socket.on('init', setPlayer);

function setPlayer(player){
    players++;
    //set player 1 to cross
    if(player==1){
        currentShape = cross;
        playerShape.innerText += "cross.";
    }else if(player==2){
        currentShape = nought;
        playerShape.innerText += "nought.";
        startGame = true; 
    }
    
  initialScreen.style.display = "none";
  gameScreen.style.display = "block";
    
    
}




/*function start(){
    startGame = true;
    loop();
}*/


//const gameScreen = document.getElementById('gameScreen');

function preload(){
    nought = loadImage("images/nought.png");
    cross = loadImage("images/cross.png");

}

var resetGameBut;


function setup() {
  // put setup code here
  createCanvas(1000,700);
    
    tracker = [
        ['','',''],
        ['','',''],
        ['','','']
    ];
    
    
    boardXSize = 400;
    boardYSize = 400;
    
    boardX = 100;
    boardY = 100;
    
    boardSpace = int(400/3);
    
    blank = createImage(boardX,boardY)
    
    for(let i=0; i<3;i++){
        squares[i] = [];
        blankButs[i] = [];
        for(let j=0; j<3; j++){
            squares[i][j] = new BoardCo(boardX + (j*boardSpace),boardY + (i*boardSpace));
            blankButs[i][j] = new Button(boardX + (j*boardSpace),boardY + (i*boardSpace),blank);
        }
    }
    
    currentShape = cross;
    
    clicked = false;
    
    //resetGameBut = createButton("New Game");
    //resetGameBut.position(500,590);
    //resetGameBut.mousePressed(resetGame);
    //socket = io.connect('http://localhost:3000');
    //socket.on('move',setBoard);
    
    noLoop();
}

function resetGame(){
    socket.emit('resetGame'); 
    console.log("reset game please");
}

var checker;
var tracker;

function setBoard(data){
    tracker = data
}


function crossSelect(){
    currentShape = cross;
}

function noughtSelect(){
    currentShape = nought;
}


function handleStart(){
    //check number of players
    if(players==1){
        text("Waiting for another player to join...",100,100);
    }else if(players==2){
        //text("Starting the game...",100,100);
        startGame = true; 
    }
}

function draw() {
     background(260);
       handleStart();
    if(startGame){
  // put drawing code here
    background(200);
    
    drawBoard();
    
    drawBoardShapes();
    //image(cross,boardX,boardY);
    //image(nought,boardX+boardSpace,boardY+boardSpace);
    //blankBut.display();
    
   for(let i=0; i<3;i++){
        for(let j=0; j<3; j++){
            checker = blankButs[i][j].display();
            if(checker){
                if(currentShape==cross){
                clientData.data[i][j] = "X";
                }else if(currentShape==nought){
                clientData.data[i][j] = "O";
                }
                //var data = tracker;
                socket.emit('move',clientData); 
            }
        }
   }
    
    
    
    /*for(var i=0; i<9; i++){
        blankButs[i].display();
    }*/

    
    checkWin();
    
    
    clicked = false;
    }

}

function drawBoardShapes(){
       for(let i=0; i<3;i++){
        for(let j=0; j<3; j++){
            if(clientData.data[i][j] == "X"){
                image(cross,squares[i][j].x,squares[i][j].y);
            }else if(clientData.data[i][j] == "O"){
                image(nought,squares[i][j].x,squares[i][j].y);
            }
        }
   }
}

function checkWin(){
    //check horizontal lines
    for(var i=0; i<3; i++){
        if(clientData.data[i][0]!= '' && clientData.data[i][0] == clientData.data[i][1] && clientData.data[i][0] == clientData.data[i][2] && clientData.data[i][1] == clientData.data[i][2]){
            playerWon(clientData.data[i][0]);
        }
    }
    
    //check vertical lines
    for(var i=0; i<3; i++){
        if(clientData.data[0][i]!= '' && clientData.data[0][i] == clientData.data[1][i] && clientData.data[0][i] == clientData.data[2][i] && clientData.data[1][i] == clientData.data[2][i]){
            playerWon(clientData.data[0][i]);
        }
    }
    
    //check diagonals
    if(clientData.data[0][0]!= '' && clientData.data[0][0] == clientData.data[1][1] && clientData.data[0][0] == clientData.data[2][2] && clientData.data[1][1] == clientData.data[2][2]){
        playerWon(clientData.data[0][0]);
    }
    
    if(clientData.data[2][0]!= '' && clientData.data[2][0] == clientData.data[1][1] && clientData.data[2][0] == clientData.data[0][2] && clientData.data[1][1] == clientData.data[0][2]){
        playerWon(clientData.data[2][0]);
    }
    
}

var winner;

function playerWon(winnerIn){
    if(winnerIn=="X"){
        winner = "Cross";
    }else if(winnerIn == "O"){
        winner = "Noughts";
    }
    textSize(45);
    stroke(0);
    text(winner + " has won!!!", 600,400);
}


class BoardCo{
    constructor(xIn,yIn){
        this.x = xIn;
        this.y = yIn;
    }
}

function mouseClicked(){
    clicked = true;
    
}
function drawBoard(){
    //draw box
    fill(255);
    rect(boardX,boardY,boardXSize,boardYSize);
    //draw lines 
    stroke(0);
    line(boardX+boardSpace,boardY,boardX+boardSpace,boardY+boardYSize);
    line(boardX+2*boardSpace,boardY,boardX+2*boardSpace,boardY+boardYSize);
    
    line(boardX,boardY+boardSpace,boardX+boardXSize,boardY+boardSpace);
    line(boardX,boardY+2*boardSpace,boardX+boardXSize,boardY+2*boardSpace);
}

class Button {
  
  constructor(inX, inY, inImg) {
    this.x = inX;
    this.y = inY;
    this.img = inImg;
  }
  
  display() {
    stroke(0);
    
    // tint the image on mouse hover
    if (this.over()) {
        //send data
        
        
        //this.img = currentShape;
      /*this.img = currentShape;
        if(currentShape == cross){
            currentShape = nought;
        }else if(currentShape == nought){
            currentShape = cross;
        }*/
        return true;
    } 
    
    //image(this.img, this.x, this.y);
  }
  
  // over automatically matches the width & height of the image read from the file
  // see this.img.width and this.img.height below
  over() {
    if (clicked && mouseX > this.x && mouseX < this.x + this.img.width && mouseY > this.y && mouseY < this.y + this.img.height) {
      return true;
    } else {
      return false;
    }
  }
}



