
$(document).ready(function(){

	var canvasElement = $("#canvas")[0];
	var canvas = canvasElement.getContext("2d");

	var HEIGHT = $("#canvas").height();
	var WIDTH = $("#canvas").width();

	//Player
	var Player = {
		color: "black",
		x: 50,
		y: 50,
		width: 32,
		height: 32,
		fallingSpeed: 0.0,
		xDirection: 0,
		canJump: true,
		onBlock: false,

		draw: function(){
			canvas.fillStyle = this.color;
	    	canvas.fillRect(this.x, this.y, this.width, this.height);
		},

		update: function(){
			//moving
			this.x += this.xDirection * 6;

			//left block collision
			
			if(this.xDirection == -1){
				var leftCollisionBlock = {x: this.x -1, y: this.y, width: 1, height: this.height}		
				for(var i = 0; i < Blocks.length; i++){
					if(collides(leftCollisionBlock, Blocks[i])){
						this.x = Blocks[i].x+Blocks[i].width;
						break;
					}
				}
			}
			else if(this.xDirection == +1){
				var rightCollisionBlock = {x: this.x +this.width, y: this.y, width: 1, height: this.height}		
				for(var i = 0; i < Blocks.length; i++){
					if(collides(rightCollisionBlock, Blocks[i])){
						this.x = Blocks[i].x-this.width;
						break;
					}
				}
			}

			if(this.x < 0)this.x = 0;
			if(this.x > WIDTH-this.width)this.x = WIDTH-this.width;

			//gravity
			this.fallingSpeed += 2.5;
			if(this.fallingSpeed > 25){this.fallingSpeed =25;}
			this.y += this.fallingSpeed;
			
			if(!this.canJump || this.onBlock){
				
				var bottomColllisionBlock = {x: this.x, y: this.y + this.height, width: this.width, height: 1}
				
				for(var i = 0; i < Blocks.length; i++){
					if(collides(bottomColllisionBlock,Blocks[i])){
						this.y = Blocks[i].y - this.height;
						this.fallingSpeed = 0;
						this.canJump = true;
						this.onBlock = true;
						break;
					}
				}
				
			}
			
			if(!(this.y < HEIGHT-this.height)){this.y = HEIGHT-this.height; fallingSpeed = 0; this.canJump = true;}

		},

		jump: function(){
			if(this.canJump){
				this.fallingSpeed = -20;
				this.canJump = false;
			}

		}
	};

	var Blocks = [];
	var canCreate = true;



	//Keyinputs
	$(document).bind("keydown", "left", function() { Player.xDirection = -1; });
	$(document).bind("keyup", "left", function() { Player.xDirection = 0; });
	$(document).bind("keydown", "right", function() { Player.xDirection = +1; });
	$(document).bind("keyup", "right", function() { Player.xDirection = 0; });

	$(document).bind("keydown", "up", function() { Player.jump(); });
	$(document).bind("keydown", "space", function() { Player.jump(); });

	$(document).bind("keyup", "f", function(){canCreate = true;})
	$(document).bind("keydown", "f", function(){if(canCreate){Blocks.push(createBlock({width:32, height:32})); canCreate = false;}})

	

	//SETUP ENGINE
	var FPS = 35;
	setInterval(function(){
		update();
		draw();
	}, 1000/FPS);



	//update function - game logic
	function update(){
		Player.update();

		Blocks.forEach(function(bullet) {
	    	bullet.update();
	  	});

	}

	//draw function - drawing objects
	function draw(){
		canvas.fillStyle = "white";
		canvas.fillRect(0, 0, WIDTH, HEIGHT);
		canvas.strokeStyle = "black";
		canvas.strokeRect(0, 0, WIDTH, HEIGHT);
		
		
		Player.draw();

		Blocks.forEach(function(bullet) {
	    	bullet.draw();
	  	});
	}

	function collides(a, b) {
	  return a.x < b.x + b.width &&
	         a.x + a.width > b.x &&
	         a.y < b.y + b.height &&
	         a.y + a.height > b.y;
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
				Block.color = "red";
				break;
			case 2:
				Block.color = "green";
				break;

			case 3:
				Block.color = "orange";
				break;
		}

		Block.falling = true;

		Block.x = Math.round(Math.random()*(WIDTH/Block.width -1))*Block.width;
		Block.y = -32;

		Block.fallingSpeed = 0;


		Block.update = function(){
			if(Block.falling){
				Block.fallingSpeed += 3;
				if(Block.fallingSpeed > 30){Block.fallingSpeed = 30;}
				Block.y += Block.fallingSpeed;

				for(var i = 0; i < Blocks.length; i++){
					if(Block != Blocks[i] && collides(this,Blocks[i])){
						Block.y = Blocks[i].y-Block.height;
						Block.falling = false;
						break;
					}
				}

				if(Block.y > HEIGHT-Block.width) {Block.y = HEIGHT-Block.width; Block.fallingSpeed = 0;Block.falling = false;}
				
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

})


