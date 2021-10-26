const WIDTH=500,//declaring width size for canvas
      HEIGHT=500,//declaring size of height for canvas 
      canvas=document.getElementById('canvas'),//calling canvas from html file
      context=canvas.getContext('2d');

canvas.width=WIDTH;//assigning WIDTH to the canvas
canvas.height=HEIGHT;//assigning Height to the canvas
canvas.style.background="#DC143C";//background colour red

//Variables
var blockArr=[],//Array for displaying yellow blocks
    blockIndex=0,//for giving number to each block
    numBlockCol=7,//no of columns for theblocks
    numBlockRow=4,//no of rows
    colWidth=WIDTH/numBlockCol,
    padding=colWidth/4; 

var blockProp={
    w:colWidth,//giving width to the block
    h:padding  //giving height to the block
}
var playerProp={
x:(WIDTH/2-colWidth/2),
y:(HEIGHT-1.5*padding),
w:colWidth,
h:padding
}

var ballProp={
    x:WIDTH/2,
    y:HEIGHT/2,
    radius:padding/3
}
InitializeBlocks(); 
var player=new Player(playerProp.x, playerProp.y, playerProp.w, playerProp.h);//creating object of player
var ball=new Ball(ballProp.x, ballProp.y, ballProp.radius);//Object creation
//Initialize the Blocks
function InitializeBlocks(){
    for(let i=1;i<numBlockCol;i++){
        for(let j=0;j<numBlockRow;j++){
            blockArr[blockIndex]=new Block( padding/2+(i)*(colWidth)-colWidth/2,colWidth+j*(colWidth-2*padding),blockProp.w-padding,blockProp.h,true); 
            blockIndex++;       
        }                 
    }
}

//Block function
function Block(x, y, width, height, isShow){
    this.x=x;//for x coordinate of the block   
    this.y=y;//for y coordinate of the block
    this.width=width;//for width of the block
    this.height=height;//for height of the block
    this.isShow=isShow;//to show the block or not 
}

//Display Blocks
function DisplayBlocks(){
    blockArr.forEach((b)=>{
        if(b.isShow){
            context.beginPath();
            context.fillStyle='#FFA500';
            context.fillRect(b.x, b.y, b.width,b.height);
            context.closePath();
        }
    });
}

//Player function
function Player (x, y, width, height)
{
    this.x=x;//for x coordinate of the player
    this.y=y;//for y coordinate of the player
    this.width=width;//for width of the player
    this.height=height;//for height of the player
    this.lifeCount=3;//life count=3
    this.xDirSpeed=0;//initial speed in x direction
}
Player.prototype.drawPlayer=function(){
    context.beginPath();
    context.fillStyle='#32CD32';
    context.fillRect(this.x, this.y, this.width, this.height);
    context.closePath();
}
//Ball function
function Ball(x, y, radius)
{
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.xDirSpeed=Math.random()<0.5?2:-2;
    this.yDirSpeed=Math.random()<0.5?2:-3;
}
Ball.prototype.drawBall=function(){
    context.beginPath();
    context.fillStyle='#FFFAFA';
    context.arc(this.x, this.y, this.radius,0,2*MATH.PI);
    context.fill();
    context.closePath();
}
Ball.prototype.updateBall=function(){
    this.x+=this.xDirSpeed;
    this.y+=this.yDirSpeed;

    //if ball hits the left, right and top of the canvas
    if(this.x-this.radius<0){
        this.xDirSpeed=-this.xDirSpeed;
    }else if(this.x+this.radius>WIDTH){
        this.xDirSpeed=-this.xDirSpeed;
    }else if(this.y-this.radius<0){
        this.yDirSpeed=this.yDirSpeed;
    }
}
function drawGame(){
    DisplayBlocks();
    player.drawPlayer();
    ball.drawBall();
}
function updateGame(){
    ball.updateBall();
}
function animateGame(){
    context.clearRect(0,0,WIDTH, HEIGHT);
    drawGame();
    updateGame();

    requestAnimationFrame(animateGame);
}

drawGame();

