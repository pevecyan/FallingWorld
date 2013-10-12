
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

		draw: function(){
			canvas.fillStyle = this.color;
	    	canvas.fillRect(this.x, this.y, this.width, this.height);
		},

		update: function(){
			//moving
			this.x += this.xDirection * 5;
			if(this.x < 0)this.x = 0;
			if(this.x > WIDTH-this.width)this.x = WIDTH-this.width;

			//gravity
			this.fallingSpeed += 2.5;
			this.y += this.fallingSpeed;
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
	var FPS = 30;
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

	//Game objects creation
	function createBlock(Block){

		//Block.width = 32;
		//Block.height = 32;

		var colorNumber = Math.round(Math.random()*3);
		switch(colorNumber){
			case 0:
				Block.color = "blue";
				break;
			case 1:
				Block.color = "red";
				break;
			case 2:
				Block.color = "green";
				break;
		}



		Block.x = Math.round(Math.random()*(WIDTH/Block.width -1))*Block.width;
		Block.y = -32;

		Block.fallingSpeed = 0;


		Block.update = function(){
			Block.fallingSpeed += 3;
			Block.y += Block.fallingSpeed;
			if(Block.y > HEIGHT-Block.width) {Block.y = HEIGHT-Block.width; Block.fallingSpeed = 0;}
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


