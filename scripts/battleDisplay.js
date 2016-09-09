// Blackjack battle display
//Hero and Dragon Sprites used (tastefully) without permission from Dragon Force (Sega Saturn)
// Written by: Matthew Moldowan
animInitBattleDisplay();

//Initialize sprites for battle sequence
function animInitBattleDisplay(){
	$('#playerSprite').animateSprite({
		fps: 4, 
		animations: {
			ready: [0, 1, 2],
			attack: [4, 5, 6, 7],
			hit: [8, 9, 10],
			die: [12, 13, 14]},
		loop: true
		});
	$('#dealerSprite').animateSprite({
		fps: 3, 
		animations: {
			ready: [1, 2],
			attack: [4, 5, 6],
			hit: [8, 9],
			die: [12, 13, 14, 15]},
		loop: true,
		});
}


//Returns player to ready pose
function animPlayerReady(){
$('#playerSprite').animateSprite('play', 'ready');
$('#playerSprite').animateSprite('fps', 4);
}

//Returns dealer to ready pose
function animDealerReady(){
	$('#dealerSprite').animateSprite('play', 'ready');
	$('#dealerSprite').animateSprite('fps', 3);
}

//Player attacks
function animPlayerAttack(){
	$('#playerSprite').animateSprite('play', 'attack');
	$('#playerSprite').animateSprite('fps', 3);
	setTimeout(function(){
		animPlayerReady();
		animDealerHit();
		sfx.play('hit2');
	}, 1000);
}

//Dealer gets hit
function animDealerHit(){
	$('#dealerSprite').animateSprite('fps', 6);
	$('#dealerSprite').animateSprite('play', 'hit');
	setTimeout(function(){
		animDealerReady();
	}, 400);
}

//Dealer attacks
function animDealerAttack(){
	$('#dealerSprite').animateSprite('play', 'attack');
	$('#dealerSprite').animateSprite('fps', 4);
	setTimeout(function(){
		animDealerReady();
		animPlayerHit();
		sfx.play('hit1');
	}, 1000);
}

//animate player being hit
function animPlayerHit(){
	$('#playerSprite').animateSprite('fps', 6);
	$('#playerSprite').animateSprite('play', 'hit');
	setTimeout(function(){
		animPlayerReady();
	}, 400);
}

function animDealerKill(){
	$('#dealerSprite').animateSprite('play', 'attack');
	$('#dealerSprite').animateSprite('fps', 4);
	setTimeout(function(){
		animDealerReady();
		animPlayerDie();
		sfx.play('hit1');
	}, 950);
}

function animPlayerDie(){
	$('#playerSprite').animateSprite('play', 'die');
	$('#playerSprite').animateSprite('fps', 1);
	$('#dealerSprite').animateSprite('fps', 1);
	sfx.play('death');
	sfx.fade(1, 0, 2500);
	bgMusic.fade(0.4, 0, 500, function(){bgMusic.stop()}); //stop bg music
	setTimeout(function(){
		$('#playerSprite').animateSprite('stop');
		if(!musicMuted)
		{
			bgMusic.play('lose');
			bgMusic.fade(0, 0.4, 15); //start lose music
		}
	}, 2500);
}

function animPlayerKill(){
	$('#playerSprite').animateSprite('play', 'attack');
	$('#playerSprite').animateSprite('fps', 3);
	setTimeout(function(){
		animPlayerReady();
		animDealerDie();
		sfx.play('hit1');
	}, 950);
}

function animDealerDie(){
	$('#dealerSprite').animateSprite('play', 'die');
	$('#dealerSprite').animateSprite('fps', 1);
	$('#playerSprite').animateSprite('fps', 1);
	bgMusic.fade(0.6, 0, 500, function(){bgMusic.stop()}); //stop bg music
	sfx.play('death');
	sfx.fade(1, 0, 3500);
	setTimeout(function(){
		$('#dealerSprite').animateSprite('stop');
		startFireworks();
		if(!musicMuted)
		{
			bgMusic.play('win');
			bgMusic.fade(0, 0.6, 1); //start win music
		}
	}, 3500);
}

function animDraw(){
	$('#playerSprite').animateSprite('play', 'attack');
	$('#playerSprite').animateSprite('fps', 3);
	$('#dealerSprite').animateSprite('play', 'attack');
	$('#dealerSprite').animateSprite('fps', 3);
	setTimeout(function(){
		animPlayerReady();
		animDealerReady();
		sfx.play('clash');
	}, 1300);

}