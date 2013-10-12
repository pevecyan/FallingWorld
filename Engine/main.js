
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
			this.x += this.xDirection * 5;


			//gravity
			this.fallingSpeed += 2.5;
			this.y += this.fallingSpeed;
			if(!(this.y < HEIGHT-this.height)){this.y = HEIGHT-this.height; fallingSpeed = 0; this.canJump = true}
		},

		jump: function(){
			if(this.canJump){
				this.fallingSpeed = -20;
				this.canJump = false;
			}

		}
	};
	
	//Keyinputs
	$(document).bind("keydown", "left", function() { Player.xDirection = -1; });
	$(document).bind("keyup", "left", function() { Player.xDirection = 0; });
	$(document).bind("keydown", "right", function() { Player.xDirection = +1; });
	$(document).bind("keyup", "right", function() { Player.xDirection = 0; });

	$(document).bind("keydown", "up", function() { Player.jump(); });



	//SETUP ENGINE
	var FPS = 30;
	setInterval(function(){
		update();
		draw();
	}, 1000/FPS);



	//update function - game logic
	function update(){
		Player.update();
	}

	//draw function - drawing objects
	function draw(){
		canvas.fillStyle = "white";
		canvas.fillRect(0, 0, WIDTH, HEIGHT);
		canvas.strokeStyle = "black";
		canvas.strokeRect(0, 0, WIDTH, HEIGHT);

		Player.draw();
	
	}

})


