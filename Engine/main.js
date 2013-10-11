var Player;


$(document).ready(function(){

	var canvasElement = $("#canvas")[0];
	var canvas = canvasElement.getContext("2d");

	var HEIGHT = $("#canvas").height();
	var WIDTH = $("#canvas").width();

	//Player
	Player = {
		color: "black",
		x: 50,
		y: 50,
		width: 32,
		height: 32,

		draw: function(){
			canvas.fillStyle = this.color;
	    	canvas.fillRect(this.x, this.y, this.width, this.height);
		}
	};
	

	$(document).bind("keydown", "left", function() { Player.x++; });



	//SETUP ENGINE
	var FPS = 30;
	setInterval(function(){
		update();
		draw();
	}, 1000/FPS);

	function draw(){
		canvas.fillStyle = "white";
		canvas.fillRect(0, 0, WIDTH, HEIGHT);
		canvas.strokeStyle = "black";
		canvas.strokeRect(0, 0, WIDTH, HEIGHT);

		Player.draw();
	
	}

})

function update(){

}

