
/*
	TODO:

		1) better key detection - DONE

		2) better collision detection - DONE ( a few bugs )

		3) sprite animation
			a) how to handle player state?

		4) world constructor
			a) blocks - DONE
			b) other objects

		5) mechanics
			a) memory - DONE
			b) interactions?
			c) double jump

		6) Bugs
			a) slow down after like 2 mins
			b) holding space fucks with falling
			c) jumping up to a ledge causes a weird flight

		7) Implement keyframe animation

*/


window.onload = function() {

	var mainCanvas = document.getElementById('mainCanvas');
	var mainContext = mainCanvas.getContext('2d');

	
	var level1 = 
		{
			'startPositionX': 100,
			'startPositionY': 50,
			'blocks': [
				/*{
					'x': 0,
					'y': 20,
					'width': 90,
					'height': 20,
				},*/

				{
					'x': 60,
					'y': 90,
					'width': 20,
					'height': 190,
				},

				{
					'x': 300,
					'y': 200,
					'width': 150,
					'height': 20,
				},

				{
					'x': 0,
					'y': 260,
					'width': 500,
					'height': 40,
				},
			]

		};
		

	//constructor for Level and its objects
	function Level(level, ctx) {

		this.blocks = level.blocks;
		this.startPositionX = level.startPositionX;
		this.startPositionY = level.startPositionY;


		this.draw= function(){	
			this.blocks.forEach(function(block){
				//ctx.beginPath();
				ctx.rect(block.x, block.y, block.width, block.height);
				ctx.stroke();
				//ctx.closePath();
			})

		}
	}

	//main game stuff


	var theFirstLevel = new Level(level1, mainContext);
	var myGuy = new Player(theFirstLevel.startPositionX, theFirstLevel.startPositionY);
	console.log(theFirstLevel.startPositionY);
/*
	
	CONTROLS
	
*/

	//keep pressed keys in state to get around lag when holding down left and right
	var keyState = {};

	document.addEventListener('keydown', function(event){
			keyState[event.keyCode || event.which] = true;
		
	}, true);

	document.addEventListener('keyup', function(event){
		keyState[event.keyCode || event.which] = false;

		if(event.keyCode == 37 || event.keyCode == 39){

			myGuy.running = false;
			myGuy.runFrame = 1;
		}
	}, true);

	function controlLoop() {
		
		//left key
		if(keyState[37]) {
			myGuy.moveLeft(); 
		}

		//right key
		if(keyState[39]){
			myGuy.moveRight();
		}

		//f key
		if (keyState[70]){
			myGuy.imprintMemory();
			keyState[70] = false;
		}

		//g key
		if (keyState[71]){
			myGuy.recallMemory();
			keyState[71] = false;
		}

		//space
		if(keyState[32]){
			//console.log(myGuy.airborne);

			if(!myGuy.airborne){
				myGuy.jump();
			}
			//prevent holding space
			keyState[32] = false;
		}

		setTimeout(controlLoop, 10);
	}


/******************

	PHYSICS AND DRAWING

*****************/


	function gravity(){

		var gravityConstant = .2; //acceleration while falling
		var terminalVelocity = 2; //max falling speed

		if ( myGuy.airborne == true){
			if( myGuy.ySpeed >= 0 && myGuy.ySpeed <= terminalVelocity) {
				myGuy.ySpeed = myGuy.ySpeed + gravityConstant;
			}


			myGuy.y = myGuy.y + myGuy.ySpeed;
		} /*else {
			myGuy.ySpeed = 0;
		}*/
	}



	function update() {


		//jumping and falling
		if (myGuy.jumping) {
			myGuy.y -= myGuy.jumpHeight;
			myGuy.falling = false;
		} else {
			myGuy.falling = true;
			myGuy.airborne = true;
		}

		// vertical collision detection
			if(myGuy.airborne == true && myGuy.falling == true){

				for (var i = 0; i < level1.blocks.length; i++){

					if(checkCollisionBottom(myGuy, level1.blocks[i])){
						myGuy.y = level1.blocks[i].y - myGuy.height;
						myGuy.ySpeed = 0;
						myGuy.airborne = false;
						myGuy.falling = false;
						break;
					} else {
						//console.log('collision is settting airborne to true');
						//myGuy.airborne = true;
						gravity();
					}

				}

			}
			
		level1.blocks.forEach(function(block){
			if(checkCollisionTop(myGuy, block)){
				myGuy.jumping = false;
				myGuy.jumpHeight = 0;
			}

		});

		//horizontal collision detection
		level1.blocks.forEach(function(block){

			if(checkCollisionLeft(myGuy, block)){
				myGuy.x = block.x + block.width;
				myGuy.xVelocity = 0;
			} 

			if(checkCollisionRight(myGuy, block)){
				myGuy.x = block.x - myGuy.width;
				myGuy.xVelocity = 0;
			}

		});

		//horizontal moves
		myGuy.xVelocity *= myGuy.friction;
		myGuy.x = myGuy.x + myGuy.xVelocity;
		
		controlLoop();

		//console.log('update: airborne: ' + myGuy.airborne);
	}

	function draw(ctx) {

		ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		ctx.beginPath();

		theFirstLevel.draw();


		myGuy.draw(ctx);
		ctx.closePath();
		
	}

var lastTime;
function main() {
	
	//not using the time/'per second' stuff yet

	/*var now = Date.now();
	var dt = (now - lastTime) / 1000.0;*/

	update();
	draw(mainContext);

	//lastTime = now;
	requestAnimationFrame (main);
}

main();
}