function createBlock(Block, Player, Blocks, WIDTH,HEIGHT,canvas, ParticlesBlood, ParticlesFloor, x, y){


	
	//Block.width = 32;

	//Block.height = 32;

	Block.colorNumber = Math.round(Math.random()*20);
	
	
	Block.sprite = Sprite("blocks/"+Block.colorNumber);
			

	Block.falling = true;

	if(x == -1 && y == -1)
	{
		Block.x = Math.round(Player.x/32)*32;
		Block.y = -256;
	}
	else
	{
		Block.x = x;
		Block.y = y;
	}

	//Block.x = Math.round(Math.random()*(WIDTH/Block.width -1))*Block.width;
	

	Block.fallingSpeed = 0;

	Block.gridY = -1;
	Block.gridX = Block.x/32


	Block.update = function()
	{
		if(Block.falling)
		{
			Block.fallingSpeed += 3;
			if(Block.fallingSpeed > 20){Block.fallingSpeed = 20;}
			Block.y += Block.fallingSpeed;

			for(var i = 0; i < Blocks.length; i++)
			{
				if(Block != Blocks[i] && collides(this,Blocks[i]) && !Blocks[i].falling)
				{
					Block.y = Blocks[i].y-Block.height;
					Block.falling = false;
					//placedBlocks[Block.y/32][Block.x/32] = Block;
					Block.gridY = Block.y / 32;
					break;
				}
			}


			if(Block.y > HEIGHT-Block.width)
			{
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
			var centerPlayerBlock = {x: Player.x+Player.width/2-Player.width/8, y: Player.y, width: Player.width/4, height: Player.height};

			if(collides(centerPlayerBlock,Block))
			{
				fatalBlock = Blocks.indexOf(Block);
				for(var i = 0; i < 200; i++)
				{
					var xDirt = Math.round(Math.random()*50)-25;
					var yDirt = Math.round(Math.random()*10)-7;
					var h = Math.round(Math.random()*5)+2;
					var w = Math.round(Math.random()*5)+2;
					ParticlesBlood.push(createParticleBlood({xDir: xDirt, yDir: yDirt, width:w, height: h},Player, Blocks, WIDTH, HEIGHT, canvas));
					
					Player.dead = true;
				}
			}
			else if(collides(leftPlayerBlock,Block))
			{
				fatalBlock = Blocks.indexOf(Block);
				for(var i = 0; i < 100; i++)
				{
					var xDirt = Math.round(Math.random()*25)+1;
					var yDirt = Math.round(Math.random()*5)-10;
					var h = Math.round(Math.random()*4)+2;
					var w = Math.round(Math.random()*4)+2;
					ParticlesBlood.push(createParticleBlood({xDir: xDirt, yDir: yDirt, width:w, height: h},Player, Blocks, WIDTH, HEIGHT, canvas));
				}
				Player.x = Block.x+Block.width;
			}
			else if(collides(rightPlayerBlock,Block))
			{
				fatalBlock = Blocks.indexOf(Block);
				for(var i = 0; i < 100; i++){
					var xDirt = Math.round(Math.random()*25)-26;
					var yDirt = Math.round(Math.random()*5)-10;
					var h = Math.round(Math.random()*4)+2;
					var w = Math.round(Math.random()*4)+2;
					ParticlesBlood.push(createParticleBlood({xDir: xDirt, yDir: yDirt, width:w, height: h},Player, Blocks, WIDTH, HEIGHT, canvas));
				}
				Player.x = Block.x-Player.width;
			}
			
		}
	};

	Block.draw = function()
	{
		//canvas.fillStyle = Block.color;
		//canvas.fillRect(Block.x, Block.y, Block.width, Block.height);
		//canvas.strokeStyle = "red";
		//canvas.strokeRect(Block.x, Block.y, Block.width, Block.height);
		Block.sprite.draw(canvas, Block.x, Block.y);
	};

	return Block;
}

function createParticleBlood(Particle, Player,Blocks, WIDTH, HEIGHT, canvas){
		//xDir,yDir,height,width come from object creation

		Particle.x = Player.x + Player.width/2;
		Particle.y = Player.y + Player.height/2,

		Particle.fallingSpeed = 0;

		Particle.isMoving = true,
		Particle.draw = true;

		var colorNum = Math.floor(Math.random()*150)+100;

		Particle.color = colorNum.toString(16)+"0000";

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
				canvas.fillStyle = Particle.color;
				canvas.fillRect(Particle.x,Particle.y,Particle.width,Particle.height);
			}
		}

		return Particle;
	}