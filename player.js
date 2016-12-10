//constructor for Player object
	function Player(x, y) {

		this.x = x;
		this.y = y;
		this.height = 30;  
		this.width = 30;

		//sprites

		this.standingLeft =new Image();
		this.standingLeft.src = "img/stand-left.png";

		this.standingRight =new Image();
		this.standingRight.src = "img/stand-right.png";


		//movement
		this.friction = .9;
		this.xSpeed = 3;
		this.xVelocity = 0;
		this.xVelocityFactor = 5;
		this.ySpeed = 0;
		this.stroke = '#000000';
		this.jumpHeight = 10;

		//state
		this.facing = 'right';
		console.log('setting initial airborne');
		this.airborne = true;
		this.jumping = false;


		this.currentMemory;

		function Memory(x, y, airborne) {
			this.x = x;
			this.y = y;
			this.airborne = airborne;
			this.width = 15;
			this.height = 15;

			this.standingLeft =new Image();
			this.standingLeft.src = "img/stand-left.png";

			this.standingRight =new Image();
			this.standingRight.src = "img/stand-right.png";

			this.draw = function(ctx){
				//ctx.beginPath();
				if(this.facing == 'right'){
					ctx.drawImage(this.standingRight, this.x, this.y, this.width-2, this.height-2);
				} else {
					ctx.drawImage(this.standingLeft, this.x, this.y, this.width-2, this.height-2);
				}
				//ctx.closePath();
			}
		}

		this.moveLeft = function(){
			this.facing = 'left';
			if (this.xVelocity > -this.xSpeed) {
            	this.xVelocity += -this.xVelocityFactor;
        	}
		}

		this.moveRight = function(){
			this.facing = 'right';
			if (this.xVelocity < this.xSpeed) {
            	this.xVelocity += this.xVelocityFactor;;
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
			this.jumpHeight = 13;		
			this.jumping = false;
		}

		this.imprintMemory = function() {

			
			if(!this.currentMemory){
				  this.currentMemory = new Memory(this.x, this.y, this.airborne);
			}	
		}

		this.recallMemory = function() {
			if(this.currentMemory){
				this.x = this.currentMemory.x;
				this.y = this.currentMemory.y;
				this.airborne = this.currentMemory.airborne;
				
				//here, we can add a few milliseconds of airborne = false;

				this.currentMemory = null;

			}	
		}

		this.debug = function() {
			//console.log(this);
		}

	}

	Player.prototype.draw = function(ctx) {

		if(this.facing == 'right'){
			ctx.drawImage(this.standingRight, this.x, this.y, this.width, this.height);
		} else {
			ctx.drawImage(this.standingLeft, this.x, this.y, this.width, this.height);
		}
		
		if(this.currentMemory){
			this.currentMemory.draw(ctx);
		}
		
	}