
/*
	TODO:

		1) better key detection - DONE

		2) better collision detection - DONE ( a few bugs )

		3) sprite animation - DONE
			a) how to handle player state?

		4) world constructor
			a) blocks - DONE
			b) other objects -DONE

		5) mechanics
			a) memory - DONE
			b) interactions?
			c) double jump

		6) Bugs
			a) slow down after like 2 mins - I think this is fixed
			b) holding space fucks with falling - FIXED
			c) jumping up to a ledge causes a weird flight - FIXED

		7) Implement keyframe animation - DONE

*/


window.onload = function() {

	var mainCanvas = document.getElementById('mainCanvas');
	var mainContext = mainCanvas.getContext('2d');
	mainContext.font = '20px Arial';
	mainContext.textAlign = 'center';
	
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

	function gameWin() {

		mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		mainContext.fillText('you beat the game!', 300, 150);

		setTimeout( function() {
			window.location.reload(true);
		}, 4000);
	}

	function levelWin() {

		if(currentLevel < levels.length - 1){

			mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
			mainContext.fillText('level complete!', 300, 150);

			setTimeout(function(){
			gameState = 'play';
			//move to next level
				currentLevel++;
				reset();
				main();
			}, 2000);
		} else {
				gameWin();
		}
	}

	function gameOver(){
		gameState = 'game over';
		mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		mainContext.fillText('dead :(', 300, 150);

		setTimeout(function(){
			gameState = 'play';
			currentLevel = 0;
			reset();
			console.log(myGuy.jumpHeight);
			main();
		}, 2000);
	}


/******************

	PHYSICS AND DRAWING

*****************/


	function gravity(){

		var gravityConstant = .2; //acceleration while falling
		var terminalVelocity = 2; //max falling speed



		if ( myGuy.airborne == true && myGuy.falling == true){
			if( myGuy.ySpeed >= 0 && myGuy.ySpeed <= terminalVelocity) {
				myGuy.ySpeed = myGuy.ySpeed + gravityConstant;
			}
			myGuy.y = myGuy.y + myGuy.ySpeed;
		} 

		/*if ( myGuy.cantFall == true ){
			
			setTimeout(function(guy) {
				return function() {
					console.log(guy.cantFall, guy.airborne, guy.falling);
					guy.cantFall == false;
				};
				
			}(myGuy), 2000);
		}*/
	}



	function update() {

		//jumping and falling
		if (myGuy.jumping == true) {
			myGuy.y -= myGuy.jumpHeight;
			myGuy.falling = false;
		} /*else if (myGuy.cantFall == true){
			myGuy.falling = false;
		} */else {
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
						//console.log(myGuy.x);
						break;
					} else {
						gravity();
					}
				}
			}

			/*if(myGuy.cantFall == false) {
				gravity();
			}*/

			if( (myGuy.y + myGuy.height) > mainCanvas.height) {
				gameState = 'game over';
			}
			
		levels[currentLevel].blocks.forEach(function(block){
			if(checkCollisionTop(myGuy, block)){
				myGuy.jumping = false;
				myGuy.jumpHeight = 0;
			}

		});

		//horizontal collision detection
		levels[currentLevel].blocks.forEach(function(block){

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

		if(checkCollisionRight(myGuy, theLevel.key) || checkCollisionTop(myGuy, theLevel.key) || checkCollisionLeft(myGuy, theLevel.key) || checkCollisionBottom(myGuy, theLevel.key)){
			myGuy.hasKey = true; 
		}

		if (checkCollisionRight(myGuy, theLevel.exit) || (checkCollisionLeft(myGuy, theLevel.exit))) {
			if(myGuy.hasKey == true){
				gameState = 'win';
			}
			
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

		if(!myGuy.hasKey) {
			theLevel.drawKey();
		}


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

	mainContext.fillText('MEMORY MAN', 300, 150);
	setTimeout(main, 1000);
	
	

}