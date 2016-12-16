//constructor for Level and its objects
	function Level(level, ctx) {

		this.blocks = level.blocks;
		this.startPositionX = level.startPositionX;
		this.startPositionY = level.startPositionY;
		this.exit = level.exit;
		this.key = level.key;

		this.keySprite = new Image;
		this.keySprite.src = 'img/key.png';

		//in case we want level-specific backgrounds in the future
		this.background = new Image;
		this.background.src = 'img/background.png';

		this.draw= function(){	

			ctx.drawImage(this.background, 0, 0, mainCanvas.width, mainCanvas.height);

			this.blocks.forEach(function(block){

				ctx.fillStyle = 'white';
				ctx.fillRect(block.x, block.y, block.width, block.height);

			});

			//draw exit
			ctx.fillStyle = '#00ff96';
			ctx.fillRect(this.exit.x, this.exit.y, this.exit.width, this.exit.height);

			ctx.fillStyle = 'black';

		}

		this.drawKey = function() {
			//draw key
			ctx.drawImage(this.keySprite, this.key.x, this.key.y, 25, 25);
			
		}
	}
