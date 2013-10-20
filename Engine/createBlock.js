function createBlock(Player,Blocks,Block){
		var HEIGHT = 480;
		var WIDTH = 480;
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


		Block.update = function(){
			if(Block.falling){
				Block.fallingSpeed += 3;
				if(Block.fallingSpeed > 30){Block.fallingSpeed = 30;}
				Block.y += Block.fallingSpeed;

				for(var i = 0; i < Blocks.length; i++){
					if(Block != Blocks[i] && collides(this,Blocks[i])){
						Block.y = Blocks[i].y-Block.height;
						Block.falling = false;
						placedBlocks[Block.y/32][Block.x/32] = Block;
						break;
					}
				}


				if(Block.y > HEIGHT-Block.width) {
					Block.y = HEIGHT-Block.width;
					Block.fallingSpeed = 0;
					Block.falling = false;
					placedBlocks[Block.y/32][Block.x/32] = Block;

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