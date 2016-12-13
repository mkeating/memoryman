
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
			'exit': {
				'x': 250,
				'y': 220,
				'width': 10,
				'height': 40,
			},

			'blocks': [

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

	var level2 = 
		{
			'startPositionX': 250,
			'startPositionY': 50,
			'blocks': [

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

	
/*****************
	
	CONTROLS
	
******************/

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

			if(!myGuy.airborne){
				myGuy.jump();
			}
			//prevent holding space
			keyState[32] = false;
		}

		setTimeout(controlLoop, 10);
	}

/******************
	
	GAME STATES

*******************/


	//initial build
	var currentLevel = 0;
	var theLevel = new Level(levels[currentLevel], mainContext);
	var myGuy = new Player(theLevel.startPositionX, theLevel.startPositionY);

	function reset(){
		theLevel = new Level(levels[currentLevel], mainContext);
		myGuy = new Player(theLevel.startPositionX, theLevel.startPositionY);
	}


	var gameState = 'play';

	function levelWin() {
		console.log('level complete!');

		mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		setTimeout(function(){
			gameState = 'play';
			//move to next level
			if(currentLevel < levels.length - 1){
				currentLevel++;
				reset();
				main();
			} else {
				console.log('gamewin');
			}
			
		}, 2000);

	}

	function gameOver(){
		console.log('game over');
		mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		setTimeout(function(){
			gameState = 'play';
			reset();
			main();
		}, 2000);
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

				for (var i = 0; i < levels[currentLevel].blocks.length; i++){

					if(checkCollisionBottom(myGuy, levels[currentLevel].blocks[i])){
						myGuy.y = levels[currentLevel].blocks[i].y - myGuy.height;
						myGuy.ySpeed = 0;
						myGuy.airborne = false;
						myGuy.falling = false;
						break;
					} else {
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

		//check for level success
		if (checkCollisionRight(myGuy, levels[currentLevel].exit) || (checkCollisionLeft(myGuy, levels[currentLevel].exit))) {
			gameState = 'win';
		}

		//horizontal moves
		myGuy.xVelocity *= myGuy.friction;
		myGuy.x = myGuy.x + myGuy.xVelocity;
		
		controlLoop();
	}

	function draw(ctx) {

		ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		ctx.beginPath();

		theLevel.draw();


		myGuy.draw(ctx);
		ctx.closePath();
		
	}

	function main() {

		update();
		draw(mainContext);

		if (gameState == 'play'){
			requestAnimationFrame (main);
		} else if (gameState == 'win'){
			levelWin();
		}
		else{
			gameOver();
		}	
	}

	main();
}