
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

	//main canvas setup
	var canvasElement = $("#canvas")[0];
	var canvas = canvasElement.getContext("2d");

	var HEIGHT = $("#canvas").height();
	var WIDTH = $("#canvas").width();

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
	var oldTime = 0;

	var fatalBlock;

	var rowsRemoved;


	var PlayerSprite = Sprite("Player");

	//Player
	var Player = {
		sprite: PlayerSprite,
		color: "black",
		x: WIDTH/2-16,
		y: 0,
		width: 32,
		height: 32,
		fallingSpeed: 0.0,
		xDirection: 0,
		canJump: false,
		onBlock: false,

		draw: function(){
			//canvas.fillStyle = this.color;
	    	//canvas.fillRect(this.x, this.y, this.width, this.height);
	    	this.sprite.draw(canvas, this.x, this.y);
		},

		update: function(){
			//moving
			this.x += this.xDirection;
			if(this.xDirection < 0 && this.canJump){
				for(var i = 0; i < Math.abs(this.xDirection)/4; i++){
						var xDirt = Math.round(Math.random()*5);
						var yDirt = Math.round(Math.random()*5)-10;
						var h = Math.round(Math.random()*5)+2
						var w = Math.round(Math.random()*5)+2
						ParticlesFloor.push(createParticleFloor({xDir: xDirt, yDir: yDirt, width:w, height: h, fall: false}))
					}
			}
			if(this.xDirection > 0 && this.canJump){
				for(var i = 0; i < Math.abs(this.xDirection)/4; i++){
						var xDirt = Math.round(Math.random()*5)*-1;
						var yDirt = Math.round(Math.random()*5)-10;
						var h = Math.round(Math.random()*5)+2
						var w = Math.round(Math.random()*5)+2
						ParticlesFloor.push(createParticleFloor({xDir: xDirt, yDir: yDirt, width:w, height: h, fall: false}))
					}
			}

			//left block collision
			
			if(this.xDirection < 0){
				var leftCollisionBlock = {x: this.x -1, y: this.y, width: 1, height: this.height}		
				for(var i = 0; i < Blocks.length; i++){
					if(collides(leftCollisionBlock, Blocks[i])){
						this.x = Blocks[i].x+Blocks[i].width;
						break;
					}
				}
			}
			else if(this.xDirection > 0){
				var rightCollisionBlock = {x: this.x +this.width, y: this.y, width: 1, height: this.height}		
				for(var i = 0; i < Blocks.length; i++){
					if(collides(rightCollisionBlock, Blocks[i])){
						this.x = Blocks[i].x-this.width;
						break;
					}
				}
			}

			if(this.x < 0){this.x = 0;this.xDirection = 0;}
			if(this.x > WIDTH-this.width){this.x = WIDTH-this.width;this.xDirection = 0;}

			//gravity
			this.fallingSpeed += 2.5;
			if(this.fallingSpeed > 30){this.fallingSpeed =30;}
			this.y += this.fallingSpeed;
			
			if(!this.canJump || this.onBlock){
				
				var bottomColllisionBlock = {x: this.x, y: this.y + this.height, width: this.width, height: 1}
				
				for(var i = 0; i < Blocks.length; i++){
					if(collides(bottomColllisionBlock,Blocks[i])){
						this.y = Blocks[i].y - this.height;
						this.fallingSpeed = 0;

						if(!this.canJump){
							for(var i = 0; i < 20; i++){
								var xDirt = Math.round(Math.random()*20)-10;
								var yDirt = Math.round(Math.random()*2)-8;
								var h = Math.round(Math.random()*5)+2
								var w = Math.round(Math.random()*5)+2
								ParticlesFloor.push(createParticleFloor({xDir: xDirt, yDir: yDirt, width:w, height: h, fall: true}))
							}
						}

						this.canJump = true;
						this.onBlock = true;
						break;
					}
				}
				
				
			}
			
			if(!(this.y < HEIGHT-this.height)){
				this.y = HEIGHT-this.height;
				fallingSpeed = 0;

				if(!this.canJump){
					for(var i = 0; i < 20; i++){
						var xDirt = Math.round(Math.random()*20)-10;
						var yDirt = Math.round(Math.random()*2)-8;
						var h = Math.round(Math.random()*5)+2
						var w = Math.round(Math.random()*5)+2
						ParticlesFloor.push(createParticleFloor({xDir: xDirt, yDir: yDirt, width:w, height: h, fall: true}))
					}
				}

				this.canJump = true;

				
			}

		},

		jump: function(){
			if(this.canJump){
				this.fallingSpeed = -20;
				this.canJump = false;
				this.onBlock = false;
			}

		}
	};

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
	setInterval(function(){
		update();
		draw();
	}, 1000/FPS);



	//update function - game logic
	function update(){
		//time manipulation
		currentTime = new Date().getTime();


		keyInput();


		if(gameState == 0){
			if(!movingTitle){
				elapsedTimeForIntro += currentTime-previousTime;
				if(elapsedTimeForIntro > 2000){
					
					movingTitle = true;
				}
			}else{

				titleMovingSpeed+=2;
				titleY-=titleMovingSpeed;
				if(titleY < -150){titleY = -150; gameState = 1;}
			}

		}else if(gameState == 1){

			if(movingMenu){
				menuMovingSpeed += 2;
				menuOffsetY-= menuMovingSpeed;
				if(menuOffsetY < 300){menuOffsetY = 300; movingMenu = false;}
			}else{

			}


		}
		else if(gameState == 2){
			//Elements updates
			Player.update();
			Blocks.forEach(function(block) {block.update();});
		  	ParticlesBlood.forEach(function(particle) {particle.update();});
		  	ParticlesFloor.forEach(function(particle) {particle.update();});


		  	//row full check
			var isFull = false;

		  	var bottomBlocks = [];
		  	bottomBlocks = Blocks.filter(function(block) {return block.gridY == HEIGHT/32-1;});
			if(bottomBlocks.length >= WIDTH/32)isFull = true;
			if(isFull){
				for(var i = 0; i < Blocks.length; i++){
					if(Blocks[i].y ==WIDTH/32 -1 ){Blocks.splice(i,1);}
					else if(Blocks[i].gridY != -1){
							Blocks[i].y += 32;
							Blocks[i].gridY++;
					}
				}
		  		ParticlesBlood.forEach(function(particle) {particle.y+=32;});
		  		rowsRemoved++;
			}

			if(ParticlesBlood.length > 1000){
	  			for(var i = 0; i < ParticlesBlood.length-1000; i++){ParticlesBlood.shift();}
	  		}
			if(ParticlesFloor.length > 100){
		  		for(var i = 0; i < ParticlesFloor.length-100; i++){ParticlesFloor.shift();}
	  		}

			elapsedTimeForBlock += currentTime-previousTime;
			if(elapsedTimeForBlock > 1000){Blocks.push(createBlock({width:32, height:32})); elapsedTimeForBlock = 0;}
		}

	  	
	  	


		previousTime = currentTime;
	}

	//draw function - drawing objects
	function draw(){
		canvas.fillStyle = "white";
		canvas.fillRect(0, 0, WIDTH, HEIGHT);
		



		if(gameState == 0){

			menuBackground.draw(canvas,0,titleY);
		}
		else if(gameState == 1){
			menuBackground.draw(canvas,0,titleY);
			if(selectedMenu == 0)startGameMenuHower.draw(canvas,WIDTH/2 - 80,menuOffsetY);
			else startGameMenu.draw(canvas,WIDTH/2 - 80,menuOffsetY);

			if(selectedMenu == 1)optionsMenuHower.draw(canvas,WIDTH/2-80, menuOffsetY +50);
			else optionsMenu.draw(canvas,WIDTH/2-80, menuOffsetY +50);
		}
		else if(gameState == 2){
			//canvas draw setup
			
		
			//drawing elements
			Player.draw();

			Blocks.forEach(function(bullet) {bullet.draw();});
	  		ParticlesBlood.forEach(function(particle) {particle.draw();});
	  		ParticlesFloor.forEach(function(particle) {particle.draw();});

	  		//time between frames count;
	  		canvas.font="30px Arial";
			canvas.fillText(previousTime-oldTime,10,50);

			canvas.font="30px Arial";
			canvas.fillText(HEIGHT/32 - Math.round(Player.y/32)+rowsRemoved,200,50);


			oldTime = previousTime;
		} 	
		canvas.strokeStyle = "black";
		canvas.strokeRect(0, 0, WIDTH, HEIGHT);
	}

	function keyInput(){
		/*LEFT RIHT MOVEMENT*/

		if(gameState == 1){
			if(Keys.down && !pressedButton){
				selectedMenu = (selectedMenu+1)%2;
				pressedButton = true;
				
			}
			if(Keys.up && !pressedButton){
				selectedMenu--;
				if(selectedMenu < 0){selectedMenu = 1;}
				pressedButton = true;
				
				
			}if(!Keys.down && !Keys.up){
				pressedButton = false;
			}



			if(Keys.enter && selectedMenu == 0){
				setupGame();
				gameState++;
				
			}
		}
		if(gameState == 2){
			if(Keys.left){
				Player.xDirection -= 1.5;
				if(Player.xDirection < -10){Player.xDirection = -10;}
			}
			if(Keys.right){
				Player.xDirection += 1.5;
				if(Player.xDirection > 10){Player.xDirection = 10;}
			}
			if(!Keys.left && !Keys.right){
				if(Player.xDirection == 0){}
				else if(Player.xDirection < 0){
					Player.xDirection += 4;
					if(Player.xDirection >= 0){Player.xDirection = 0;} 
				}else if(Player.xDirection > 0){
					Player.xDirection -= 4;
					if(Player.xDirection <= 0){Player.xDirection = 0;}
				}
			}
			/**/
			if(Keys.jump){
				Player.jump();
			}
		}
	}

	function collides(a, b) {
	  return a.x < b.x + b.width &&
	         a.x + a.width > b.x &&
	         a.y < b.y + b.height &&
	         a.y + a.height > b.y;
	}

	function setupGame(){
		Player.x = WIDTH/2-16;
		Player.y = 0;

		rowsRemoved = 0;

		for(var x = 0; x < WIDTH/32; x++){
			var height = Math.round(Math.random()*7)+1;
			for(var y = height; y >= 0; y--){
				Blocks.push(createCustomBlock(x*32, (y+2)*32, {width:32, height:32}));
				//Blocks.push(createBlock({width:32, height:32}));
			}
		}
	}

	//Game objects creation
	function createBlock(Block){

		//Block.width = 32;
		//Block.height = 32;

		Block.colorNumber = Math.round(Math.random()*3);
		switch(Block.colorNumber){
			case 0:
				Block.color = "blue";
				break;
			case 1:
				Block.color = "darkgray";
				break;
			case 2:
				Block.color = "green";
				break;

			case 3:
				Block.color = "orange";
				break;
		}

		Block.falling = true;

		//Block.x = Math.round(Math.random()*(WIDTH/Block.width -1))*Block.width;
		Block.x = Math.round(Player.x/32)*32;
		Block.y = -32;

		Block.fallingSpeed = 0;

		Block.gridY = -1;
		Block.gridX = Block.x/32


		Block.update = function(){
			if(Block.falling){
				Block.fallingSpeed += 3;
				if(Block.fallingSpeed > 30){Block.fallingSpeed = 30;}
				Block.y += Block.fallingSpeed;

				for(var i = 0; i < Blocks.length; i++){
					if(Block != Blocks[i] && collides(this,Blocks[i]) && !Blocks[i].falling){
						Block.y = Blocks[i].y-Block.height;
						Block.falling = false;
						//placedBlocks[Block.y/32][Block.x/32] = Block;
						Block.gridY = Block.y / 32;
						break;
					}
				}


				if(Block.y > HEIGHT-Block.width) {
					Block.y = HEIGHT-Block.width;
					Block.fallingSpeed = 0;
					Block.falling = false;
					//placedBlocks[Block.y/32][Block.x/32] = Block;
					Block.gridY = Block.y / 32;

				}
				/*var topPlayerCollision = {x:Player.x, y:Player.y-16, height: 16, width: Player.width}
				if(collides(topPlayerCollision,Block)){
					Player.fallingSpeed = Block.fallingSpeed
				}*/
				var leftPlayerBlock = {x: Player.x, y: Player.y, width: Player.width/4, height: Player.height};
				var rightPlayerBlock = {x: Player.x+Player.width*3/4, y: Player.y, width: Player.width/4, height: Player.height};
				var centerPlayerBlock = {x: Player.x+Player.width/2-Player.width/4, y: Player.y, width: Player.width/2, height: Player.height};

				if(collides(centerPlayerBlock,Block)){
					fatalBlock = Blocks.indexOf(Block);
					for(var i = 0; i < 100; i++){
						var xDirt = Math.round(Math.random()*50)-25;
						var yDirt = Math.round(Math.random()*5)-10;
						var h = Math.round(Math.random()*5)+2
						var w = Math.round(Math.random()*5)+2
						ParticlesBlood.push(createParticleBlood({xDir: xDirt, yDir: yDirt, width:w, height: h}))
					}
				}
				else if(collides(leftPlayerBlock,Block)){
					fatalBlock = Blocks.indexOf(Block);
					for(var i = 0; i < 50; i++){
						var xDirt = Math.round(Math.random()*25)+1;
						var yDirt = Math.round(Math.random()*5)-10;
						var h = Math.round(Math.random()*4)+2
						var w = Math.round(Math.random()*4)+2
						ParticlesBlood.push(createParticleBlood({xDir: xDirt, yDir: yDirt, width:w, height: h}))
					}
					Player.x = Block.x+Block.width;
				}
				else if(collides(rightPlayerBlock,Block)){
					fatalBlock = Blocks.indexOf(Block);
					for(var i = 0; i < 50; i++){
						var xDirt = Math.round(Math.random()*25)-26;
						var yDirt = Math.round(Math.random()*5)-10;
						var h = Math.round(Math.random()*4)+2
						var w = Math.round(Math.random()*4)+2
						ParticlesBlood.push(createParticleBlood({xDir: xDirt, yDir: yDirt, width:w, height: h}))
					}
					Player.x = Block.x-Player.width;
				}
				
			}
		};

		Block.draw = function(){
			canvas.fillStyle = Block.color;
			canvas.fillRect(Block.x, Block.y, Block.width, Block.height);
			//canvas.strokeStyle = "red";
			//canvas.strokeRect(Block.x, Block.y, Block.width, Block.height);
		};

		return Block;
	}

	//createBLOCK custom
	function createCustomBlock(x, y, Block){

		//Block.width = 32;
		//Block.height = 32;

		Block.colorNumber = Math.round(Math.random()*3);
		switch(Block.colorNumber){
			case 0:
				Block.color = "blue";
				break;
			case 1:
				Block.color = "darkgray";
				break;
			case 2:
				Block.color = "green";
				break;

			case 3:
				Block.color = "orange";
				break;
		}

		Block.falling = true;

		//Block.x = Math.round(Math.random()*(WIDTH/Block.width -1))*Block.width;
		Block.x = x;
		Block.y = y;

		Block.fallingSpeed = 0;

		Block.gridY = -1;
		Block.gridX = Block.x/32


		Block.update = function(){
			if(Block.falling){
				Block.fallingSpeed += 3;
				if(Block.fallingSpeed > 30){Block.fallingSpeed = 30;}
				Block.y += Block.fallingSpeed;

				for(var i = 0; i < Blocks.length; i++){
					if(Block != Blocks[i] && collides(this,Blocks[i]) && !Blocks[i].falling){
						Block.y = Blocks[i].y-Block.height;
						Block.falling = false;
						//placedBlocks[Block.y/32][Block.x/32] = Block;
						Block.gridY = Block.y / 32;
						break;
					}
				}


				if(Block.y > HEIGHT-Block.width) {
					Block.y = HEIGHT-Block.width;
					Block.fallingSpeed = 0;
					Block.falling = false;
					//placedBlocks[Block.y/32][Block.x/32] = Block;
					Block.gridY = Block.y / 32;

				}
				/*var topPlayerCollision = {x:Player.x, y:Player.y-16, height: 16, width: Player.width}
				if(collides(topPlayerCollision,Block)){
					Player.fallingSpeed = Block.fallingSpeed
				}*/
				var leftPlayerBlock = {x: Player.x, y: Player.y, width: Player.width/4, height: Player.height};
				var rightPlayerBlock = {x: Player.x+Player.width*3/4, y: Player.y, width: Player.width/4, height: Player.height};
				var centerPlayerBlock = {x: Player.x+Player.width/2-Player.width/4, y: Player.y, width: Player.width/2, height: Player.height};

				if(collides(centerPlayerBlock,Block)){
					fatalBlock = Blocks.indexOf(Block);
					for(var i = 0; i < 100; i++){
						var xDirt = Math.round(Math.random()*50)-25;
						var yDirt = Math.round(Math.random()*5)-10;
						var h = Math.round(Math.random()*5)+2
						var w = Math.round(Math.random()*5)+2
						ParticlesBlood.push(createParticleBlood({xDir: xDirt, yDir: yDirt, width:w, height: h}))
					}
				}
				else if(collides(leftPlayerBlock,Block)){
					fatalBlock = Blocks.indexOf(Block);
					for(var i = 0; i < 50; i++){
						var xDirt = Math.round(Math.random()*25)+1;
						var yDirt = Math.round(Math.random()*5)-10;
						var h = Math.round(Math.random()*4)+2
						var w = Math.round(Math.random()*4)+2
						ParticlesBlood.push(createParticleBlood({xDir: xDirt, yDir: yDirt, width:w, height: h}))
					}
					Player.x = Block.x+Block.width;
				}
				else if(collides(rightPlayerBlock,Block)){
					fatalBlock = Blocks.indexOf(Block);
					for(var i = 0; i < 50; i++){
						var xDirt = Math.round(Math.random()*25)-26;
						var yDirt = Math.round(Math.random()*5)-10;
						var h = Math.round(Math.random()*4)+2
						var w = Math.round(Math.random()*4)+2
						ParticlesBlood.push(createParticleBlood({xDir: xDirt, yDir: yDirt, width:w, height: h}))
					}
					Player.x = Block.x-Player.width;
				}
				
			}
		};

		Block.draw = function(){
			canvas.fillStyle = Block.color;
			canvas.fillRect(Block.x, Block.y, Block.width, Block.height);
			//canvas.strokeStyle = "red";
			//canvas.strokeRect(Block.x, Block.y, Block.width, Block.height);
		};

		return Block;
	}

	//BLOOD PARTICLES
	function createParticleBlood(Particle){
		//xDir,yDir,height,width come from object creation

		Particle.x = Player.x + Player.width/2;
		Particle.y = Player.y + Player.height/2,

		Particle.fallingSpeed = 0;

		Particle.isMoving = true,
		Particle.draw = true;

		Particle.update =  function(){
			if(Particle.isMoving){
				Particle.fallingSpeed += 1;
				
				Particle.x+= Particle.xDir;
				Particle.y+= Particle.yDir + Particle.fallingSpeed;
			

				for(var i = 0; i < Blocks.length; i++){
					if(i != fatalBlock && collides(Particle,Blocks[i])){
						Particle.isMoving = false;
						
					}
				}
				if(Particle.x < 0){Particle.x = 0; Particle.isMoving = false;}
				if(Particle.x > WIDTH-Particle.width){Particle.x = WIDTH-Particle.width; Particle.isMoving = false;}
				if(Particle.y > HEIGHT-Particle.height){Particle.y = HEIGHT-Particle.height; Particle.isMoving = false;}
			}
		};

		Particle.draw = function(){
			if(Particle.draw){
				canvas.fillStyle = "red";
				canvas.fillRect(Particle.x,Particle.y,Particle.width,Particle.height);
			}
		}

		return Particle;
	}

	function createParticleFloor(Particle){
		//xDir,yDir,height,width come from object creation

		if(!Particle.fall){

			if(Player.xDirection < 0){
				Particle.x = Player.x + Player.width-4;
			}else {
				Particle.x = Player.x + 4;
			}
		}else{
			Particle.x = Player.x + Player.width/2;
		}
		Particle.y = Player.y + Player.height,

		Particle.fallingSpeed = 0;

		Particle.isMoving = true,
		Particle.draw = true;

		Particle.update =  function(){
			if(Particle.isMoving){
				Particle.fallingSpeed += 1;
				
				Particle.x+= Particle.xDir;
				Particle.y+= Particle.yDir + Particle.fallingSpeed;
			
				/*
				for(var i = 0; i < Blocks.length; i++){
					if(i != fatalBlock && collides(Particle,Blocks[i])){
						Particle.isMoving = false;
						
					}
				}
				*/

				if(Particle.y > HEIGHT-Particle.height){Particle.y = HEIGHT-Particle.height; Particle.isMoving = false;}
			}
		};

		Particle.draw = function(){
			if(Particle.draw){
				canvas.fillStyle = "black";
				canvas.fillRect(Particle.x,Particle.y,Particle.width,Particle.height);
			}
		}
		return Particle;
	}

})


