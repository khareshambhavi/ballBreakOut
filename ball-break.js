//made by arjun and shambhavi
const WIDTH=500,//declaring width size for canvas
HEIGHT=500,//declaring size of height for canvas 
canvas=document.getElementById('canvas'),//calling canvas from html file
context=canvas.getContext('2d');

canvas.width=WIDTH;//assigning WIDTH to the canvas
canvas.height=HEIGHT;//assigning Height to the canvas
canvas.style.background="#FF0000";//background colour red

//Variables
var blockArr=[],//Array for displaying yellow blocks
blockIndex=0,//for giving number to each block
numBlockCol=7,//no of columns for theblocks
numBlockRow=4,//no of rows
colWidth=WIDTH/numBlockCol,//equal distribution of width of a column
padding=colWidth/4, //padding between rows
isGameOver=false;//variable to tell if the game is over after 3 lives

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
  if(b.isShow){//if the block is being displayed
      context.beginPath();//begin path to create the blocks which have to be broken(top)
      context.fillStyle='#FFA500';//fill colour 
      context.fillRect(b.x, b.y, b.width,b.height);//to make the block rectangle with dimension
      context.closePath();//close the path(end of instr. to create blocks image)
  }
});
}

//Player function
function Player (x, y, width, height){
this.x=x;//for x coordinate of the player
this.y=y;//for y coordinate of the player
this.width=width;//for width of the player
this.height=height;//for height of the player
this.lifeCount=3;//life count=3
this.xDirSpeed=0;//initial speed in x direction
}
Player.prototype.drawPlayer=function(){
context.beginPath();//begin new path to create the player block(moving, placed at the bottom)
context.fillStyle='#32CD32';//color for the player block
context.fillRect(this.x, this.y, this.width, this.height);//to make the block rectangle with dimension
context.closePath();//close the path
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
context.beginPath();//new path to draw a ball
context.fillStyle='#FFFFFF';//colour of ball
context.arc(this.x, this.y, this.radius,0,2*MATH.PI);//arc is used for creating a ball
context.fill();//used to render the object to the canvas
context.closePath();//close the path 
}
Ball.prototype.updateBall=function(playerObj){
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
//if ball hits the player
if(this.x+this.radius>playerObj.x && this.x-this.radius<(playerObj.x+playerObj.width) && this.y+this.radius>(HEIGHT-1.5*padding)){
this.yDirSpeed=-this.yDirSpeed;//change the y direction 
this.y+=this.yDirSpeed;
this.xDirSpeed+=playerObj.xDirSpeed/4;//change x direction speed
}   

//if ball is missed to hit player
if((this.x+this.radius<playerObj.x)||(this.x-this.radius)>(player.x+player.width) && this.y+this.radius>HEIGHT){//condition for missing the ball to hit player
  playerObj.lifeCount--;//to decrease the life if the condition is true
  if(player.lifeCount<=0){//if there are no lives left (i.e. in this case after 3 lives)
      isGameOver=true;//game is over 
      console.log('Game Over');//give the message to the console 

  }
  else{//if ball is missed to hit the player and the lives are left
      this.x=WIDTH/2;//condition to respawn the ball at the middle of the canvas
      this.y=HEIGHT/2;//condition to respawn the ball at the middle of the canvas
      this.xDirSpeed=Math.random()<0.5?2:-2;//to give speed to the new ball in x direction
      this.yDirSpeed=Math.random()<0.5?2:-3;//to give speed to the new ball in y direction
  }
}

}

function drawGame(){
DisplayBlocks();//calling the function to draw the blocks
player.drawPlayer();//calling the function to draw the player (bottom) block 
ball.drawBall();//calling the function to draw the ball
}
function updateGame(){
ball.updateBall(player);//calling the function to update the ball after the ball is missed or start 
}
function animateGame(){
context.clearRect(0,0,WIDTH, HEIGHT);//to clear the path of the ball(otherwise it would trace the path of the ball)
drawGame();
if(!isGameOver){//if game is not over
  updateGame();
}

requestAnimationFrame(animateGame);
}

drawGame();
