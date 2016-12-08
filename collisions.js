
	function checkCollisionBottom (player, block) {
		if( (player.y + player.height) > block.y
			&& player.y < block.y
			&& (
					player.x > block.x && (player.x + player.width) < (block.x + block.width)
				||	player.x < (block.x + block.width) && (player.x + player.width)	> (block.x + block.width)
				||	player.x < block.x && (player.x + player.width) > block.x
				||  player.x < block.x && (player.x + player.width) > (block.x + block.width)
			)
		){	
			return true;
		}
	}

	function checkCollisionTop(player, block) {
		if( player.y < (block.y + block.height)
			&& (player.y + player.height) > (block.y + block.height)
			&& (
					player.x > block.x && (player.x + player.width) < (block.x + block.width)
				||	player.x < (block.x + block.width) && (player.x + player.width)	> (block.x + block.width)
				||	player.x < block.x && (player.x + player.width) > block.x
				||  player.x < block.x && (player.x + player.width) > (block.x + block.width)
			)
		){	
			return true;
		}
	}

	//works, a little jittery though
	function checkCollisionLeft (player, block) {

			if( player.x < (block.x + block.width)
				&& (player.x + player.width) > (block.x + block.width)
				&& 
					(
						//these account for if player is within the length of the wall, or just touching it with head/foot
						player.y > block.y && (player.y + player.height) < (block.y + block.height)
					|| 	player.y < block.y && (player.y + player.height) > (block.y + block.height)
					|| 	(player.y + player.height) > block.y && (player.y + player.height) < (block.y + block.height)
					|| 	player.y > block.y && player.y < (block.y + block.height)
					
					)
			) {
				return true;
				}		
	}

	function checkCollisionRight (player, block) {

			if( player.x < block.x
				&& (player.x + player.width) > block.x
				&& 
					(
					   player.y > block.y && (player.y + player.height) < (block.y + block.height)
					|| player.y < block.y && (player.y + player.height) > (block.y + block.height)
					|| (player.y + player.height) > block.y && (player.y + player.height) < (block.y + block.height)
					|| player.y > block.y && player.y < (block.y + block.height)
					)
			) {
				return true;
			}		
	}