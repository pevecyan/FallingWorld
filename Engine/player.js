function createPlayer(PlayerSprite,PlayerLeftSprite,PlayerRightSprite,PlayerJumpUpSprite,PlayerJumpDownSprite, WIDTH, HEIGHT, canvas){
		var Player = {};

		Player.sprite = PlayerSprite;
		Player.leftSprite = PlayerLeftSprite;
		Player.rightSprite = PlayerRightSprite;
		Player.jumpUpSprite = PlayerJumpUpSprite;
		Player.jumpDownSprite = PlayerJumpDownSprite;
		Player.color = "black";
		Player.x = WIDTH/2-16;
		Player.y = 0;
		Player.width = 32;
		Player.height = 32;
		Player.fallingSpeed = 0.0;
		Player.xDirection = 0;
		Player.canJump = false;
		Player.onBlock = false;
		Player.setupGame = true;
		Player.dead = false;

		Player.draw =  function()
		{
			//canvas.fillStyle = Player.color;
	    	//canvas.fillRect(Player.x, Player.y, Player.width, Player.height);
	    	if(Player.dead){}
	    	else{
		    	if(Player.xDirection==0){
		    		if(Player.fallingSpeed<0 && Player.y !=HEIGHT-Player.height){
		    			Player.jumpUpSprite.draw(canvas, Player.x, Player.y);
		    		}else if(Player.fallingSpeed>0 && Player.y !=HEIGHT-Player.height){
		    			Player.jumpDownSprite.draw(canvas, Player.x, Player.y);
		    		}
		    		else{
		    			Player.sprite.draw(canvas, Player.x, Player.y);
		    		}
		    	}else if(Player.xDirection < 0){
		    		Player.leftSprite.draw(canvas,Player.x,Player.y);
		    	}else if(Player.xDirection>0){
		    		Player.rightSprite.draw(canvas,Player.x,Player.y);
		    	}
	    	}
		}

		Player.update = function(Blocks, ParticlesFloor)
		{
			//moving
			Player.x += Player.xDirection;
			if(Player.xDirection < 0 && Player.canJump)
			{
				for(var i = 0; i < Math.abs(Player.xDirection)/2; i++)
				{
					var xDirt = Math.round(Math.random()*5);
					var yDirt = Math.round(Math.random()*5)-10;
					var h = Math.round(Math.random()*5)+2;
					var w = Math.round(Math.random()*5)+2;
					ParticlesFloor.push(createParticleFloor({xDir: xDirt, yDir: yDirt, width:w, height: h, fall: true}, WIDTH, HEIGHT, canvas, Player));
							
				}
			}
			if(Player.xDirection > 0 && Player.canJump)
			{
				for(var i = 0; i < Math.abs(Player.xDirection)/2; i++)
				{
					var xDirt = Math.round(Math.random()*5)*-1;
					var yDirt = Math.round(Math.random()*5)-10;
					var h = Math.round(Math.random()*5)+2;
					var w = Math.round(Math.random()*5)+2;
					ParticlesFloor.push(createParticleFloor({xDir: xDirt, yDir: yDirt, width:w, height: h, fall: true}, WIDTH, HEIGHT, canvas, Player));
							
				}
			}

			//left block collision
			
			if(Player.xDirection < 0)
			{
				var leftCollisionBlock = {x: Player.x -1, y: Player.y, width: 1, height: Player.height}		
				for(var i = 0; i < Blocks.length; i++)
				{
					if(collides(leftCollisionBlock, Blocks[i]))
					{
						Player.x = Blocks[i].x+Blocks[i].width;
						break;
					}
				}
			}
			else if(Player.xDirection > 0)
			{
				var rightCollisionBlock = {x: Player.x +Player.width, y: Player.y, width: 1, height: Player.height}		
				for(var i = 0; i < Blocks.length; i++)
				{
					if(collides(rightCollisionBlock, Blocks[i]))
					{
						Player.x = Blocks[i].x-Player.width;
						break;
					}
				}
			}

			if(Player.x < 0){Player.x = 0;Player.xDirection = 0;}
			if(Player.x > WIDTH-Player.width){Player.x = WIDTH-Player.width;Player.xDirection = 0;}

			//gravity
			Player.fallingSpeed += 2.5;
			if(Player.fallingSpeed > 30){Player.fallingSpeed =30;}
			Player.y += Player.fallingSpeed;
			
			if(!Player.canJump || Player.onBlock)
			{
				
				var bottomColllisionBlock = {x: Player.x, y: Player.y + Player.height, width: Player.width, height: 1}
				
				for(var i = 0; i < Blocks.length; i++)
				{
					if(collides(bottomColllisionBlock,Blocks[i]))
					{
						if(Player.setupGame){Player.setupGame = !Player.setupGame}
						Player.y = Blocks[i].y - Player.height;
						Player.fallingSpeed = 0;

						if(!Player.canJump)
						{
							for(var i = 0; i < 20; i++)
							{
								var xDirt = Math.round(Math.random()*20)-10;
								var yDirt = Math.round(Math.random()*2)-8;
								var h = Math.round(Math.random()*5)+2;
								var w = Math.round(Math.random()*5)+2;
								ParticlesFloor.push(createParticleFloor({xDir: xDirt, yDir: yDirt, width:w, height: h, fall: true}, WIDTH, HEIGHT, canvas, Player));
							}
						}
						Player.canJump = true;
						Player.onBlock = true;
						break;
					}
				}
			}
			
			if(!(Player.y < HEIGHT-Player.height))
			{
				Player.y = HEIGHT-Player.height;
				fallingSpeed = 0;

				if(!Player.canJump)
				{
					for(var i = 0; i < 20; i++)
					{
						var xDirt = Math.round(Math.random()*20)-10;
						var yDirt = Math.round(Math.random()*2)-8;
						var h = Math.round(Math.random()*5)+2;
						var w = Math.round(Math.random()*5)+2;
						ParticlesFloor.push(createParticleFloor({xDir: xDirt, yDir: yDirt, width:w, height: h, fall: true}, WIDTH, HEIGHT, canvas, Player));
					}
				}

				Player.canJump = true;
			}
			if(Player.y >= HEIGHT-Player.height){
				fallingSpeed = 0;
			}

		}

		Player.jump = function()
		{
			if(Player.canJump)
			{
				Player.fallingSpeed = -20;
				Player.canJump = false;
				Player.onBlock = false;
			}
		}

		return Player;
}

function collides(a, b)
{
  	return a.x < b.x + b.width &&
	       a.x + a.width > b.x &&
	       a.y < b.y + b.height &&
	       a.y + a.height > b.y;
}

function createParticleFloor(Particle, WIDTH, HEIGHT, canvas, Player)
{
		//xDir,yDir,height,width come from object creation
	if(!Particle.fall)
	{
		if(Player.xDirection < 0){Particle.x = Player.x + Player.width-4;}
		else {Particle.x = Player.x + 4;}
	}
	else
	{
		Particle.x = Player.x + Player.width/2;
	}

	Particle.y = Player.y + Player.height,

	Particle.fallingSpeed = 0;

	Particle.isMoving = true,
	Particle.draw = true;

	var colorNum = Math.floor(Math.random()*110)+60;

	Particle.color = "00"+colorNum.toString(16)+"00";

	Particle.update =  function()
	{
		if(Particle.isMoving)
		{
			Particle.fallingSpeed += 1;
			
			Particle.x+= Particle.xDir;
			Particle.y+= Particle.yDir + Particle.fallingSpeed;
			if(Particle.y > HEIGHT-Particle.height){Particle.y = HEIGHT-Particle.height; Particle.isMoving = false;}
		}
	}

	Particle.draw = function()
	{
		if(Particle.draw)
		{
			canvas.fillStyle = Particle.color;
			canvas.fillRect(Particle.x,Particle.y,Particle.width,Particle.height);
		}
	}
	return Particle;
}
