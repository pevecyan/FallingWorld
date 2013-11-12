
$(document).ready(function(){


	var gameState;
	//gameStates
	//0 - intro
	//1 -mainmenu
	//11 start
	//12 options
	//13 about
	//14 instructions
	//2 - game

	gameState = 0;

	var gameOver = false;

	var startSetup;

	//main canvas setup
	var canvasElement = $("#canvas")[0];
	var canvas = canvasElement.getContext("2d");

	var HEIGHT = $("#canvas").height();
	var WIDTH = $("#canvas").width();


	var BackgroundSprite = Sprite("Background");
	var BackgroundGameSprite = Sprite("BackgroundGame");

	//time manipulation
	var previousTime = new Date().getTime();
	var currentTime = 0;

	//gamestate: 0-intro
	var menuBackground = Sprite("TitleImage");
	var elapsedTimeForIntro = 0;
	var movingTitle = false;
	var titleY = 0;
	var titleMovingSpeed = 0;

	//gamestate 1-main menu
	var startGameMenu = Sprite("StartGame");
	var startGameMenuHower = Sprite("StartGameHower");
	var optionsMenu = Sprite("Options");
	var optionsMenuHower = Sprite("OptionsHower");

	var selectedMenu = 0;
	var pressedButton = false;

	var elapsedTimeForMenu = 0;
	var movingMenu = true;
	var menuOffsetY = HEIGHT;
	var menuMovingSpeed = 0;



	//gamestate: 2-game
	//timed events;	
	var elapsedTimeForBlock = 0;

	var elapsedTimeForBlockGroup = 0;

	var oldTime = 0;

	var fatalBlock;

	var rowsRemoved;

	var gameOverSprite = Sprite("GameOver");


	var PlayerSprite = Sprite("Player");
	var PlayerLeftSprite = Sprite("PlayerLeft");
	var PlayerRightSprite = Sprite("PlayerRight");
	var PlayerJumpUpSprite = Sprite("PlayerJumpUp");
	var PlayerJumpDownSprite = Sprite("PlayerJumpDown");

	var fallingBlockX = -1;
	var fallingBlockTrailSprite = Sprite("Trail");

	//Player
	var Player = createPlayer(PlayerSprite,PlayerLeftSprite,PlayerRightSprite,PlayerJumpUpSprite,PlayerJumpDownSprite, WIDTH, HEIGHT, canvas);


	var Blocks = [];
	var ParticlesBlood = [];
	var ParticlesFloor = [];
	var canCreate = true;

	var placedBlocks = new Array(HEIGHT/32);
	for(var i = 0; i < HEIGHT/32; i++){
		placedBlocks[i] = new Array(WIDTH/32);
	}

	var Keys = {
		enter: false,
		up: false,
		down: false,
		left: false,
		right: false,
		jump: false
	}

	//

	//Keyinputs
	$(document).bind("keydown", "return", function() {Keys.enter = true; });
	$(document).bind("keyup", "return", function() {Keys.enter = false; });

	$(document).bind("keydown", "left", function() {Keys.left = true; });
	$(document).bind("keyup", "left", function() { Keys.left = false; });
	$(document).bind("keydown", "right", function() { Keys.right = true;});
	$(document).bind("keyup", "right", function() { Keys.right = false;});

	$(document).bind("keydown", "down", function() { Keys.down = true; });
	$(document).bind("keyup", "down", function() { Keys.down = false; });

	$(document).bind("keydown", "up", function() { Keys.jump = true; Keys.up = true; });
	$(document).bind("keyup", "up", function() { Keys.jump = false; Keys.up = false; });

	$(document).bind("keydown", "space", function() { Keys.jump = true; });
	$(document).bind("keyup", "space", function() { Keys.jump = false; });

	$(document).bind("keyup", "f", function(){canCreate = true;})
	$(document).bind("keydown", "f", function(){if(canCreate){Blocks.push(createBlock({width:32, height:32})); canCreate = false;}})
	$(document).bind("keydown", "e", function(){ParticlesBlood.push(createParticleBlood({xDir:-7, yDir:-4, width:4,height:4}));})
	$(document).bind("keydown", "x", function(){alert(placedBlocks);})
	$(document).bind("keydown", "b", function(){

		Blocks.forEach(function(bullet) {
	    	bullet.y++;
	  	});

	})

	

	//SETUP ENGINE
	var FPS = 35;
	setInterval(function(){update();draw();}, 1000/FPS);



	//update function - game logic
	function update()
	{
		//time manipulation
		currentTime = new Date().getTime();


		keyInput();

		if(gameState == 0)
		{
			if(!movingTitle)
			{
				elapsedTimeForIntro += currentTime-previousTime;
				if(elapsedTimeForIntro > 2000)
				{
					movingTitle = true;
				}
			}
			else
			{
				titleMovingSpeed+=2;
				titleY-=titleMovingSpeed;
				if(titleY < -150){titleY = -150; gameState = 1;}
			}
		}
		else if(gameState == 1)
		{
			if(movingMenu)
			{
				menuMovingSpeed += 2;
				menuOffsetY-= menuMovingSpeed;
				if(menuOffsetY < 300){menuOffsetY = 300; movingMenu = false;}
			}
			else
			{}
		}
		else if(gameState == 2)
		{
			//Elements updates
			Player.update(Blocks,ParticlesFloor);
			Blocks.forEach(function(block) {block.update();});
		  	ParticlesBlood.forEach(function(particle) {particle.update();});
		  	ParticlesFloor.forEach(function(particle) {particle.update();});

		  	//row full check
			var isFull = false;

		  	var bottomBlocks = [];
		  	bottomBlocks = Blocks.filter(function(block) {return block.gridY == HEIGHT/32-1;});
		  	var randomRow =  Math.round(Math.random()*(WIDTH/32));

			if(bottomBlocks.length >= WIDTH/32)isFull = true;
			if(isFull)
			{
				var  DEBUG;
				for(var i = 0; i < Blocks.length; i++)
				{
					if(Blocks[i].gridY == HEIGHT/32 -1 )
					{
						Blocks.splice(i,1);
						i--;
					}
					else if(Blocks[i].gridX == randomRow)
					{
						Blocks.splice(i,1);
						i--;
					}
					else if(Blocks[i].gridY != -1)
					{
						Blocks[i].y += 32;
						Blocks[i].gridY++;
					}
				}
		  		ParticlesBlood.forEach(function(particle) {particle.y+=32;});
		  		rowsRemoved++;
		  		
		  		
			  	elapsedTimeForBlock = 0;
			}

			if(ParticlesBlood.length > 1000)
			{
	  			for(var i = 0; i < ParticlesBlood.length-1000; i++){ParticlesBlood.shift();}
	  		}
			if(ParticlesFloor.length > 100)
			{
		  		for(var i = 0; i < ParticlesFloor.length-100; i++){ParticlesFloor.shift();}
	  		}

	  		elapsedTimeForBlockGroup += currentTime-previousTime;
	  		if(elapsedTimeForBlockGroup > 15000 && !Player.dead){
	  			if(!Player.setupGame)
		  		{
			  		for(var x = 0; x < WIDTH/32; x++)
			  		{
			  			if(x == Math.round(Player.x/32) || x == Math.round(Player.x/32) -1 || x == Math.round(Player.x/32) + 1 ||x == randomRow){}
			  			else
			  			{
			  				var height = Math.round(Math.random()*2);
			  				for(var y = 0; y < height; y++)
			  				{
			  					Blocks.push(createBlock({width:32, height:32}, Player, Blocks, WIDTH, HEIGHT, canvas, ParticlesBlood,ParticlesFloor,x*32, (y*2)*32-64));

			  				}
			  			}
			  		}
			  	}
	  			elapsedTimeForBlockGroup = 0;
	  		}

			elapsedTimeForBlock += currentTime-previousTime;
			if(elapsedTimeForBlock > 1250 && !Player.dead){fallingBlockX=Math.round(Player.x/32)*32;   Blocks.push(createBlock({width:32, height:32}, Player, Blocks, WIDTH, HEIGHT, canvas, ParticlesBlood,ParticlesFloor,-1,-1)); elapsedTimeForBlock = 0;}
		}

		previousTime = currentTime;
	}

	//draw function - drawing objects
	function draw()
	{
		//canvas.fillStyle = "white";
		//canvas.fillRect(0, 0, WIDTH, HEIGHT);
		if(gameState==2){
			BackgroundGameSprite.draw(canvas,0,0);
		}else{
			BackgroundSprite.draw(canvas,0,0);
		}

		if(gameState == 0)
		{
			menuBackground.draw(canvas,WIDTH/2 - 480/2,titleY);
		}
		else if(gameState == 1)
		{
			menuBackground.draw(canvas,WIDTH/2 - 480/2,titleY);
			if(selectedMenu == 0)startGameMenuHower.draw(canvas,WIDTH/2 - 80,menuOffsetY);
			else startGameMenu.draw(canvas,WIDTH/2 - 80,menuOffsetY);

			if(selectedMenu == 1)optionsMenuHower.draw(canvas,WIDTH/2-80, menuOffsetY +50);
			else optionsMenu.draw(canvas,WIDTH/2-80, menuOffsetY +50);
		}
		else if(gameState == 2)
		{
			//Blocks.filter(function(block) {return block.gridY == HEIGHT/32-1;});
			//drawing elements
			
			if(fallingBlockX!= -1)
			{
				for(var y = 0; y < HEIGHT/32; y++)
				{
					fallingBlockTrailSprite.draw(canvas, fallingBlockX, y*32);
		  			
					
		  		}
		  	}

			Blocks.forEach(function(block)
			{
				block.draw();
				
			});

	  		ParticlesBlood.forEach(function(particle) {particle.draw();});
	  		Player.draw();
	  		ParticlesFloor.forEach(function(particle) {particle.draw();});


	  		

	  		//time between frames count;
	  		canvas.font="30px Arial";
			canvas.fillText(previousTime-oldTime,10,50);

			canvas.font="30px Arial";
			canvas.fillText(HEIGHT/32 - Math.round(Player.y/32)+rowsRemoved,200,50);


			oldTime = previousTime;

			if(Player.dead)
			{
				gameOverSprite.draw(canvas,WIDTH/2-gameOverSprite.width/2,HEIGHT/2-gameOverSprite.height/2);
			} 	
		}

		canvas.strokeStyle = "black";
		canvas.strokeRect(0, 0, WIDTH, HEIGHT);
	}

	function keyInput(){
		/*LEFT RIHT MOVEMENT*/

		if(gameState == 1)
		{
			if(Keys.down && !pressedButton)
			{
				selectedMenu = (selectedMenu+1)%2;
				pressedButton = true;
			}
			if(Keys.up && !pressedButton)
			{
				selectedMenu--;
				if(selectedMenu < 0){selectedMenu = 1;}
				pressedButton = true;
			}
			if(!Keys.down && !Keys.up)
			{
				pressedButton = false;
			}
			if(Keys.enter && selectedMenu == 0)
			{
				setupGame();
				gameState++;
			}
		}
		if(gameState == 2 && !Player.dead)
		{
			if(Keys.left)
			{
				Player.xDirection -= 1.5;
				if(Player.xDirection < -10){Player.xDirection = -10;}
			}
			if(Keys.right
				){
				Player.xDirection += 1.5;
				if(Player.xDirection > 10){Player.xDirection = 10;}
			}
			if(!Keys.left && !Keys.right)
			{
				if(Player.xDirection == 0){}
				else if(Player.xDirection < 0)
				{
					Player.xDirection += 4;
					if(Player.xDirection >= 0){Player.xDirection = 0;} 
				}
				else if(Player.xDirection > 0)
				{
					Player.xDirection -= 4;
					if(Player.xDirection <= 0){Player.xDirection = 0;}
				}
			}
			/**/
			if(Keys.jump)
			{
				Player.jump();
			}
		}
		if(Player.dead)
		{
			if(Player.xDirection == 0){}
			else if(Player.xDirection < 0)
			{
				Player.xDirection += 4;
				if(Player.xDirection >= 0){Player.xDirection = 0;} 
			}
			else if(Player.xDirection > 0)
			{
				Player.xDirection -= 4;
				if(Player.xDirection <= 0){Player.xDirection = 0;}
			}
		}
	}

	function setupGame()
	{
		Player.x = WIDTH/2-16;
		Player.y = -64;

		rowsRemoved = 0;

		for(var x = 0; x < WIDTH/32; x++)
		{
			var height = Math.round(Math.random()*2)+2;
			for(var y = height; y >= 0; y--)
			{
				Blocks.push(createBlock({width:32, height:32}, Player, Blocks, WIDTH, HEIGHT, canvas, ParticlesBlood,ParticlesFloor,x*32, (y+2)*32));
				//reateBlock({width:32, height:32}, Player, Blocks, WIDTH, HEIGHT, canvas, ParticlesBlood,-1,-1)
				//Blocks.push(createBlock({width:32, height:32}));
			}
		}
	}

})


