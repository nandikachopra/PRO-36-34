var dog,dogImg,dogImg1;
var database;
var foodS,foodStock;
var gameState, readingGameState;
var bedroom, garden, washroom;

function preload(){
   dogImg=loadImage("Images/Dog.png");
   dogImg1=loadImage("Images/happydog.png");
   bedroom=loadImage("Images/Bed Room.png");
   garden=loadImage("Images/Garden.png");
   washroom=loadImage("Images/Wash Room.png");
  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(500,500);

  dog=createSprite(250,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  readState=database.ref('gameState');
  readState.on("value",function(data){
      gameState=data.val();
  });
}

// function to display UI
function draw() {
  background(46,139,87);
 
  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(dogImg1);
  }

  drawSprites();
  fill(255,255,254);
  stroke("black");
  text("Food remaining : "+foodS,170,200);
  textSize(13);
  text("Note: Press UP_ARROW Key To Feed Drago Milk!",130,10,300,20);

  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
  }else if(currentTime==(lastFed+2)){
      update("Sleeping");
      foodObj.bedroom();
  }else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
      foodObj.washroom();
  }else{
      update("Hungry")
      foodObj.display();
  }
}

//Function to read values from DB
function readStock(data){
  foodS=data.val();
}

//Function to write values in DB
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
}

function update(state){
    database.ref('/').update({
     gameState:state
	});
}