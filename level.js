//constructor for Level and its objects
	function Level(level, ctx) {

		this.blocks = level.blocks;
		this.startPositionX = level.startPositionX;
		this.startPositionY = level.startPositionY;
		this.exit = level.exit;


		this.draw= function(){	
			this.blocks.forEach(function(block){

				ctx.rect(block.x, block.y, block.width, block.height);
				ctx.stroke();
				
			});

			//draw exit
			ctx.rect(this.exit.x, this.exit.y, this.exit.width, this.exit.height);
			ctx.stroke();

		}
	}
