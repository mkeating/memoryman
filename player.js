//constructor for Player object
	function Player(x, y) {

		this.x = x;
		this.y = y;
		this.height = 30;  
		this.width = 30;

		//sprites

		this.sprites = {
			'standingLeft': 'img/stand-left.png',
			'standingRight': 'img/stand-right.png',
			'jumpLeft': 'img/jump-left.png', 
			'jumpRight': 'img/jump-right.png', 
			'fallLeft': 'img/fall-left.png',
			'fallRight': 'img/fall-right.png',
			'runLeft1': 'img/run-left-1.png',
			'runLeft2': 'img/run-left-2.png',
			'runLeft3': 'img/run-left-3.png',
			'runLeft4': 'img/run-left-4.png',

			'runRight1': 'img/run-right-1.png',
			'runRight2': 'img/run-right-2.png',
			'runRight3': 'img/run-right-3.png',
			'runRight4': 'img/run-right-4.png',

		}

		this.runFrame = 1;


		//movement
		this.friction = .7;
		this.xSpeed = 4;
		this.xVelocity = 0;
		this.xVelocityFactor = 4;
		this.ySpeed = 0;
		this.stroke = '#000000';
		this.jumpHeight = 7;

		//state
		this.facing = 'right';
		this.airborne = true;
		this.jumping = false;
		this.falling = false;
		this.cantFall = false;
		this.running = false;
		this.hasKey = false;


		this.currentMemory;

		function Memory(x, y, facing) {
			this.x = x;
			this.y = y;
			this.facing = facing;
			this.width = 20;
			this.height = 20;

			this.left =new Image();
			this.left.src = "img/fall-left.png";

			this.right =new Image();
			this.right.src = "img/fall-right.png";

			this.draw = function(ctx){
				
				if(this.facing == 'right'){
					ctx.drawImage(this.right, this.x, this.y, this.width, this.height);
				} else {
					ctx.drawImage(this.left, this.x, this.y, this.width, this.height);
				}
			}
		}

		this.moveLeft = function(){
			this.facing = 'left';
			this.running = true;
			if (this.xVelocity > -this.xSpeed) {
            	this.xVelocity += -this.xVelocityFactor;
        	}

        	if(this.runFrame < 4){
        		this.runFrame++;
        	} else {
        		this.runFrame = 1;
        	}
		}

		this.moveRight = function(){
			this.facing = 'right';
			this.running = true;
			if (this.xVelocity < this.xSpeed) {
            	this.xVelocity += this.xVelocityFactor;;
        	}

        	if(this.runFrame < 4){
        		this.runFrame++;
        	} else {
        		this.runFrame = 1;
        	}
		}

		this.jump = function() {
			
			if(!this.jumping && !this.airborne) {
				this.jumping = true;
				this.airborne = true;
				setTimeout(this.land.bind(this), 200);
			}
		}

		this.land = function() {
			//reset jumpHeight to initial
			this.jumpHeight = 7;		
			this.jumping = false;
		}

		this.imprintMemory = function() {

			
			if(!this.currentMemory){
				  this.currentMemory = new Memory(this.x, this.y, this.facing);
			}	
		}

		this.recallMemory = function() {
			if(this.currentMemory){
				this.x = this.currentMemory.x;
				this.y = this.currentMemory.y;

				//provides a boost when recalling memory; allows the player to travel farther if moving left or right 
				if(this.facing == 'right' && this.xVelocity > .01){
					
					this.xVelocity+= 30;
				} 
				if(this.facing == 'left' && this.xVelocity < -.01) {
					
					this.xVelocity-= 30;
				}
				//this.airborne = false;
				//this.jumping = false;
				//this.falling = false;
				//this.cantFall = true;

				//here, we can add a few milliseconds of airborne = false for double jump;

				this.currentMemory = null;

			}	
		}

		this.debug = function() {
			//console.log(this);
		}

	}

	Player.prototype.draw = function(ctx) {

		this.sprite = new Image();
		var runString;


		if(this.facing == 'right'){

			if(this.jumping == true ){
				this.sprite.src = this.sprites.jumpRight;
			} else if (this.falling == true){
				this.sprite.src = this.sprites.fallRight;
			} else if (this.running == true){
				runString = 'runRight'+this.runFrame;
				this.sprite.src = this.sprites[runString];
			} else {
				this.sprite.src = this.sprites.standingRight;
			}

			
		} else {
			if(this.jumping == true ){
				this.sprite.src = this.sprites.jumpLeft;
			} else if (this.falling == true){
				this.sprite.src = this.sprites.fallLeft;
			} else if (this.running == true){
				runString = 'runLeft'+this.runFrame;
				this.sprite.src = this.sprites[runString];
			} else {
				this.sprite.src = this.sprites.standingLeft;
			}
		}

		ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
		
		if(this.currentMemory){
			this.currentMemory.draw(ctx);
		}
		
	}