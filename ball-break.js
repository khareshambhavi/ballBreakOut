const WIDTH=500,//declaring width of the canvas
      HEIGHT=500,//declaring height of the canvas
      canvas=document.getElementById('canvas'),//calling canvas from html file
      context=canvas.getContext('2d');
canvas.width=WIDTH;//assigning WIDTH to the canvas
canvas.height=HEIGHT;//assigning height to the canvas

//Variable
var blockArr=[],//Array for displaying yellow blocks
    blockIndex=0,//for giving number to each block
    numBlockCol=7,//number of comumns of blocks
    numBlockRow=4,//no of rows of blocks
    colWidth=WIDTH/numBlockCol,//equal distribution of width of a column
    padding=colWidth/4,//padding between rows
    isGameOver=false,//variable to tell if the game is over after 3 lives
    gameLevel=1,//variable to declare the level of the game in the beginning
    numObBlocksHit=0,//variable to count the no of the blocks hit by ball
    isLeft=false,//defing the variable to move left when key is pressed
    isRight=false,//defing the variable to move right when key is pressed
    isLevelCompleted=false;//variable to check if the level is completed (when noobBlocksHit=numBlockCol*numBlockRow)

//Block Properry
var blockProp={
    w:colWidth,//giving width to the block
    h:padding//giving height to the block
}

//Player Properties
var PlayerProp={
    x:(WIDTH/2-colWidth/2),//giving x coordinates to the player block
    y:HEIGHT-(1.5*padding),//giving y coordinates to the player block
    w:colWidth,//giving width to the player block
    h:padding//giving height to the player block
}

//Ball Player
var ballProp={
    x:WIDTH/2,//giving x coordinate
    y:HEIGHT/2,//y coordinate
    radius:padding/3//radius of the ball
}

//function objects
var player=new Player(PlayerProp.x,PlayerProp.y,PlayerProp.w,PlayerProp.h);//creating object of player
var ball=new Ball(ballProp.x, ballProp.y, ballProp.radius);//creating object of ball

//function Next Level
function nextlevel(){//to go to next level
    if(isLevelCompleted){//only if the level is completed 
        if(gameLevel<4){//max level 3
            gameLevel++//increase game level
            if(gameLevel==4){         
                document.getElementById('gameover').innerHTML='Hurrah ! You win the game!';
                isGameOver=true;//to end the game
            }
            //conditions for re initialising after the level is completed and a new level is started
            numBlockCol=gameLevel=8?numBlockCol++:numBlockCol+=2;
            colWidth=WIDTH/numBlockCol;//new column width
            padding=colWidth/4;//new padding 
            //Initialize block
            blockProp.w=colWidth;//new width of the blocks
            blockProp.h=padding//new height 
            //Initialise Player
            PlayerProp.x=(WIDTH/2-colWidth/2);
            PlayerProp.y=HEIGHT-(1.5*padding);
            PlayerProp.w=colWidth;
            PlayerProp.h=padding;
            //Initialize ball
            ballProp.x=WIDTH/2;
            ballProp.y=HEIGHT/2;
            ballProp.radius=padding/3;
            
            InitializeBlock();
            ball=new Ball(ballProp.x, ballProp.y, ballProp.radius);
            player=new Player(PlayerProp.x, PlayerProp.y, PlayerProp.w, PlayerProp.h,);
            
            isGameOver=false;
            isLevelCompleted=false;
            gameLoop();
        }
    }
}

InitializeBlock();
window.addEventListener('keydown',(e)=>{//adding key from window input
    if(e.keyCode==37){
        isLeft=true;
        isRight=false;
    }else if(e.keyCode==39){
        isLeft=false;
        isRight=true;
    }
});

window.addEventListener('keyup',()=>{
    isLeft=false;
    isRight=false;
});

//Initialize the block
function InitializeBlock(){
    for(let i=1;i<numBlockCol;i++){
        for(let j=0;j<numBlockRow;j++){
            blockArr[blockIndex]=new Block(padding/2+i*(colWidth)-colWidth/2,0.7*colWidth+j*(colWidth-2*padding),blockProp.w-padding,blockProp.h,true);
            blockIndex++;
        }
    }
}

//Block function
function Block(x, y, width, height,isShow){
    this.x=x;//for x coordinate of the block  
    this.y=y;//for y coordinate of the block  
    this.width=width;//for width coordinate of the block  
    this.height=height;//for height coordinate of the block  
    this.isShow=isShow;//to show the block or not 
}

//Display Block function
 
function displayBlock(){
    blockArr.forEach((b)=>{
        if(isBallhitsBlock(ball,b) && b.isShow){//if ball is hit by block
            ball.yDirSpeed=-ball.yDirSpeed;//mirror image of y speed
            b.isShow=false;//make that block invisble
            numObBlocksHit++;//add the no of blocks that have been hit till now
            if(numObBlocksHit==(numBlockCol-1)*numBlockRow){//if all the blocks have been hit
               isLevelCompleted=true; //level completeed
               document.getElementById('gameover').innerHTML='Game Level '+gameLevel+' is completed. Click Next to begin next level';//display msg
            }
        }
        if(b.isShow){//if the block is being displayed
            context.beginPath();//begin path to create the blocks which have to be broken(top)
            context.fillStyle= '#FFA500';//fill colour
            context.fillRect(b.x, b.y, b.width,b.height);//to make the block rectangle with dimension
            context.closePath();//close path to create the blocks which have to be broken(top)
        }
    });
}

//Player function
function Player(x, y, width, height){
    this.x=x;//for x coordinate of the player
    this.y=y;//for y coordinate of the player
    this.width=width;//for width coordinate of the player
    this.height=height;//for height coordinate of the player
    this.xDirSpeed=3;//for speed of the moving block(player)
    this.lifeCount=5;//total no of lives
}

Player.prototype.drawPlayer=function(){
    context.beginPath();//begin new path to create the player block(moving, placed at the bottom)
    context.fillStyle='#ffd722';//color for the player block
    context.fillRect(this.x, this.y, this.width,this.height);//to make the block rectangle with dimension
    context.closePath();//close the path
};

Player.prototype.updatePlayer=function(x){
    
    this.x+=x;
    this.xDirSpeed=x;
   
    if(this.x<0){
        this.x=0
        this.xDirSpeed=0;
    }else if(this.x+this.width>WIDTH){
        this.x=WIDTH-this.width;
        this.xDirSpeed=0;
    }
}


//Ball function
function Ball(x, y, radius){
    this.x=x;//for x coordinate of the ball 
    this.y=y;//for y coordinate of the ball
    this.radius=radius;//for radius coordinate of the ball
    this.xDirSpeed=Math.random()<0.5?1:-1;//initial speed in x direc
    this.yDirSpeed=Math.random()<0.5?2:-2;//initial speed in y direc
}

Ball.prototype.drawBall=function(){
    context.beginPath();//new path to draw a ball
    context.fillStyle='#ffffff';//colour of ball
    context.arc(this.x, this.y, this.radius,0,2*Math.PI);//arc is used for creating a ball
    context.fill();//used to render the object to the canvas
    context.closePath();//close the path 
};

Ball.prototype.updateBall=function(playerObj){
    this.x+=this.xDirSpeed;//change the speed of ball in x direc
    this.y+=this.yDirSpeed;//change the speed of ball in y direc
    
    document.getElementById('liferemaining').innerHTML=playerObj.lifeCount;
    document.getElementById('gamelevel').innerHTML=gameLevel;
    
    //Check if ball hits the canvas boundary
    if(this.x-this.radius<0){        
        this.xDirSpeed=-this.xDirSpeed;
    }else if(this.x+this.radius > WIDTH){        
        this.xDirSpeed=-this.xDirSpeed;
    }
    else if(this.y-this.radius<0){
        this.yDirSpeed=-this.yDirSpeed;
    }
    
    //Check if ball hits the player
    if(this.x+this.radius>playerObj.x && this.x-this.radius<(playerObj.x+playerObj.width) && this.y+this.radius>(HEIGHT-(1.5*padding))){
        this.yDirSpeed=-this.yDirSpeed;
        this.y+=this.yDirSpeed;
        this.xDirSpeed+=Math.floor(playerObj.xDirSpeed/3)+1;
    }
    
    //Check if ball miss to hit the player
    if((this.x+this.radius< playerObj.x || (this.x+this.radius)>(playerObj.x+playerObj.width)) && this.y+this.radius>HEIGHT){//condition for missing the ball to hit player
        playerObj.lifeCount--;//to decrease the life if the condition is true
        if(playerObj.lifeCount<=0){//if there are no lives left (i.e. in this case after 5 lives)
            document.getElementById('gameover').innerHTML='Game Over!!!';
            document.getElementById('liferemaining').innerHTML=playerObj.lifeCount;
            isGameOver=true;//game is over
        }
        else{//if ball is missed to hit the player and the lives are left
            this.x=WIDTH/2;//condition to respawn the ball at the middle of the canvas
            this.y=HEIGHT/2;//condition to respawn the ball at the middle of the canvas
            this.xDirSpeed=Math.random()<0.5?2:-2;//to give speed to the new ball in x direction
            this.yDirSpeed=Math.random()<0.5?2:-3;//to give speed to the new ball in y direction
        }
    }
};

//function to check the collison
function isBallhitsBlock(ball, block){
    if(ball.x+ball.radius>block.x && (ball.x-ball.radius<(block.x+block.width)) && ball.y+ball.radius>block.y && ball.y-ball.radius<(block.y+block.height)){
        return true;
    }else {
        false;
    }
}

//Draw Game function
function drawGame(){
    displayBlock();//calling the function to draw the blocks
    player.drawPlayer();//calling the function to draw the player (bottom) block 
    ball.drawBall();//calling the function to draw the ball
}

//update game function
function updateGame(){
    ball.updateBall(player); //calling the function to update the ball after the ball is missed or start   
    ball.updateBall(player);//calling the function to update the ball after the ball is missed or start 
    if(isLeft){
        player.updatePlayer(-4);
    }else if(isRight){
        player.updatePlayer(4);
    }
}


function gameLoop(){
    context.clearRect(0,0,WIDTH,HEIGHT);//to clear the path of the ball(otherwise it would trace the path of the ball)
    drawGame();
    if(!isGameOver && !isLevelCompleted){//if game is not over and the level is not completed
        updateGame();        
    }    
    requestAnimationFrame(gameLoop);
}

gameLoop();