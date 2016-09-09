// Blackjack Game Prototype
// Written by: Matthew Moldowan
// Music, SFX and card sprites by Matthew Moldowan
var cardAssets;
var cardAssetsCount = 0;
var cardDeck;
var player;
var dealer;
var hitButton = document.getElementById('btnHit');
var standButton = document.getElementById('btnStand');
var newGameButton = document.getElementById('btnNewGame');
var sfx;
var bgMusic;

/***Preload All Assets*******/
var loadMusic = new Howl({
  urls: [ 'audio/load.m4a', 'audio/load.ogg'],
  autoplay: true,
  loop: true,
  volume: 0.3,
  });

bgMusic = new Howl({
	urls: [ 'audio/music_sprite.m4a', 'audio/music_sprite.ogg'],
	loop: true,
	sprite: {
    bg: [0, 32000, true],
	lose: [32418, 42667, true],
    win: [75503, 39000, true] 
    },
    onload: function(){ //load sfx
		sfx = new Howl({
		urls: ['audio/audio_sprite.m4a', 'audio/audio_sprite.mp3'],
		sprite: {
			button:[0, 731, false],
			card1:[759, 200, false],
			card2:[964, 181, false],
			hit1:[1186, 184, false],
			hit2:[1408, 204, false],
			clash:[1650, 485, false],
			death:[2135, 2584, false]
		},
	    onload: createDeck});
    }
});

function createDeck()
{
	//create list of suits
	var suit = new Array("S", "C", "D", "H");
	//create list of all card values
	var value = new Array('A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K');
	
	cardAssets = new Array(suit.length * value.length);
	
	var counter = 0;
	for(suitCount=0; suitCount<4; suitCount++)
	{
		for(valueCount=0; valueCount<13; valueCount++)
		{
			cardAssets[counter] = new Card(suit[suitCount], value[valueCount]);
			counter++
		}
	}
}

var loading = setInterval(function(){
	if(cardAssetsCount == 52)
	{
		clearInterval(loading); //stop loading
		loadMusic.fade(0.3, 0, 300, function(){loadMusic.stop()});
		$('#loadMessage').html("Click to Start.");
		$('.loading').click("click", function(){
			$('.loading').slideUp(500, function(){
				$(this).remove();	
			});
			setTimeout(newGame, 500);
		});
	}
}, 500);
/*
	*/
/*** Audio functions ****/
var btnToggleMusic = document.getElementById('btnMusic');
var musicMuted = false;
btnToggleMusic.onclick = toggleMusic;


function toggleMusic()
{
	if(musicMuted == false)
	{
		bgMusic.mute();
		btnToggleMusic.childNodes[0].nodeValue="Music On"; //innerHTML not working
		musicMuted = true;
	}
	else
	{
		//$("#musicPlayer").jPlayer("unmute");
		bgMusic.unmute();
		btnToggleMusic.childNodes[0].nodeValue="Music Off"; //innerHTML not working
		musicMuted = false;
	}
}



/* Classes */
function Player()
{
	//data members
	this.currentHand = [];
	this.scoreInHand    = 0;
	this.hitPoints_MAX  = 10;
	this.hitPoints      = this.hitPoints_MAX;
	
	//member functions
	//
	//is dealt a card from deck
	this.receiveCard = function (){
		//get card from deck
		var tempCard = cardDeck.dealCard();
		this.currentHand.push(tempCard);
		$current_card = $("#pCard" + (this.currentHand.length)).find('img');
		$current_card.show(200, function(){sfx.play('card1')});

		//animate half of card flip
		$current_card.css('-webkit-perspective', '0');
		$current_card.transition({
 	 		perspective: '72px',
  			rotateY: '90deg'
			}, function() {
				$current_card.attr('src', tempCard.img.src);
				sfx.play('card2');
				$current_card.transition({
					perspective: '72px',
					rotateY: '180deg', 
				});
				}
			);
			
		//add score of card to hand score
		this.setScoreInHand();
	}
	//calculates and sets the score of current hand
	this.setScoreInHand = function (){
		this.scoreInHand = calculateHandScore(this.currentHand);
		if(this.scoreInHand == 0)
		{
			$('#pScore').html("--") //blank score
		}
		else
		{	
			$('#pScore').html(this.scoreInHand); //update on screen score
		}
	}
	
	//resets current hand for next round
	this.resetHand = function(){
		this.currentHand = [];
		this.scoreInHand = 0;
		this.setScoreInHand();
	}
}

function Dealer()
{
	//data members
	this.currentHand = [];
	this.scoreInHand    = 0;
	this.hitPoints_MAX  = 10;
	this.hitPoints      = this.hitPoints_MAX;
	
	//member functions
	this.receiveCard = function (){
		//get card from deck
		var tempCard = cardDeck.dealCard();
		this.currentHand.push(tempCard);
		$current_card = $("#dCard" + (this.currentHand.length)).find('img');
		$current_card.show(200, function(){sfx.play('card1')});

		//animate half of card flip
		$current_card.transition({
 	 		perspective: '72px',
  			rotateY: '90deg'
			}, function() {
				$current_card.attr('src', tempCard.img.src);
				sfx.play('card2');
				$current_card.transition({
					perspective: '72px',
					rotateY: '180deg', 
				});
				}
			);
			
		this.setScoreInHand();
	}
	
	this.setScoreInHand = function (){
		this.scoreInHand = calculateHandScore(this.currentHand);
		if(this.scoreInHand == 0)
		{
			$('#dScore').html("--") //blank score
		}
		else
		{
			$('#dScore').html(this.scoreInHand); //update on screen score
		}
	}
	
	//resets current hand for next round
	this.resetHand = function(){
		this.currentHand = [];
		this.scoreInHand = 0;
		this.setScoreInHand();
	}
}

function Card(suit, value)
{
	this.suit = suit;
	this.value = value;
	this.img = new Image(); //allows preloading of face value
	this.img.src = "images/cards/" + value + suit + ".png";
	this.img.onload = function(){cardAssetsCount++};
}



/*******************************/
/***Class Deck***/
/***************/

function Deck()
{
	this.cards = new Array();
	
	//Deck functions
	this.shuffleDeck = shuffleTheDeck;
	this.dealCard	= dealCardFromDeck;
}

function shuffleTheDeck()
{
	var tempCards = cardAssets.slice();
	this.cards = new Array();
	var counter = cardAssets.length;
	var randomCardIndex;
	
	//randomly select cards and place them into new shuffled array
	while (counter > 0)
	{
		randomCardIndex = Math.floor(Math.random() * counter);
		this.cards.push(tempCards.splice(randomCardIndex, 1)[0]);
		counter--;
	}
}

function dealCardFromDeck()
{
	if (this.cards.length <= 0)
	{
		this.cards = new Array();
		this.shuffleDeck();
	}
	
	var dealtCard = this.cards.pop();
	return dealtCard;
}

/*******************************/
/**************/

/****Functions******************/

function newGame()
{
	//disable newGame to prevent bugging
	disableNewGame();
	setTimeout(enableNewGame, 3000);
	
	//stops fireworks if playing
	stopFireworks();	
	
	//Resets music
	bgMusic.stop();
	bgMusic.volume(0.4);
	bgMusic.play('bg');
	sfx.stop();
	sfx.volume(1);
	
	//init key playing objects
	player = new Player();
	dealer = new Dealer();
	cardDeck = new Deck();
	
	//set damage meters
	$('#playerCurrentHP').html(player.hitPoints_MAX);
	$('#playerMaxHP').html(player.hitPoints_MAX);
	$('#dealerCurrentHP').html(dealer.hitPoints_MAX);
	$('#dealerMaxHP').html(dealer.hitPoints_MAX);
	
	//setup deck for playing
	cardDeck.shuffleDeck();
	
	//reset battle animations
	animPlayerReady();
	animDealerReady();
	
	//start first round
	newRound();
}

function newRound()
{
	player.resetHand();
	dealer.resetHand();
	resetCardsOnTable();
	
	setTimeout(function(){
		player.receiveCard();}, 800);
		
	setTimeout(function(){
		dealer.receiveCard();}, 1600);
		
	setTimeout(function(){
		player.receiveCard();}, 2400);
		
	setTimeout(function(){
		dealer.receiveCard();}, 3200);
		
	
	//Allow player to make decision
	setTimeout(function(){
		if(player.scoreInHand == 21) //can't go higher
		{
			playerStand();
		}
		else
		{
			enableControls();
		}
	}, 3400);
}

function disableControls()
{
	hitButton.onclick = undefined; 
	standButton.onclick = undefined;
}

function enableControls()
{
	hitButton.onclick = continueHitting; 
	standButton.onclick = playerStand;
}

function disableNewGame()
{
	newGameButton.onclick = undefined;
}

function enableNewGame()
{
	newGameButton.onclick = newGame; 
}


function continueHitting()
{
	disableControls();
	player.receiveCard();
		
	setTimeout(function(){
		if(player.scoreInHand > 21) //player busts
		{
			//damage calculated based on how over 21 player went
			var damage = player.scoreInHand - 21;
			
			if((player.hitPoints - damage) <= 0) //player has no more HP
			{
				loseGame(damage);	
			}
			else
			{
				loseRound(damage); 
			}
		}
		else if(player.scoreInHand == 21) //can't go higher
		{
			playerStand();
		}
		else
		{
			//allow another decision
			enableControls();
		}
	}, 800);
}

function playerStand()
{
	disableControls();
	
	var delay = setInterval(function(){
		if(dealer.scoreInHand < 17)
		{
			dealer.receiveCard();
		}
		else
		{
			clearInterval(delay);
			if(dealer.scoreInHand > 21) //if dealer busts
			{
				var damage = dealer.scoreInHand - 21 //damage calculated based on how over dealer went
				
				if((dealer.hitPoints - damage) <= 0) //if dealer has no more HP
				{
					winGame(damage);	
				}
				else
				{
					winRound(damage);
				}
			}
			else if(dealer.scoreInHand == player.scoreInHand) //if draw
			{
				drawRound();
			}
			else if(dealer.scoreInHand > player.scoreInHand) //if dealer score beats player
			{
				//damage calculated based on how many more points dealer had
				var damage = dealer.scoreInHand - player.scoreInHand;
				
				if((player.hitPoints - damage) <= 0) //if player has no more HP
				{
					loseGame(damage);
				}
				else
				{
					loseRound(damage);	 
				}
			}
			else //player score higher
			{
				//damage calculated based on how many more points player had than dealer
				var damage = player.scoreInHand - dealer.scoreInHand;
				
				if((dealer.hitPoints - damage) <= 0) //if dealer has no more HP
				{
					winGame(damage);	
				}
				else
				{
					winRound(damage); 
				}
			}
		}
	}, 1000);
	
	
	
}

function calculateHandScore(cards)
{
	var score = 0;
	var numberOfAces = 0;
	
	for(var i = 0; i < cards.length; i++)
	{
		switch(cards[i].value) {
			case 'A':
				 numberOfAces++;
				 break;
			case 'K':
			case 'Q':
			case 'J':
				score += 10;
				break;
			default:
				score += cards[i].value;
				break;
		}
	}
	
	if (numberOfAces > 0)
	{
		for(var i = 1; i <= numberOfAces; i++)
		{
			if(score <=10){
				score += 11;	
			}else{
				score += 1;	
			}
		}
	}
	
	return score;
}

function loseRound(damage){
	animDealerAttack();
	setTimeout(function() {
		displayPlayerDMG(damage);
	}, 1000);
	setTimeout(newRound, 1300);
}

function winRound(damage){
	animPlayerAttack();
	setTimeout(function() {
		displayDealerDMG(damage);
	}, 1000);
	setTimeout(newRound, 1300);
}

function drawRound(){
	animDraw();
	setTimeout(newRound, 1300);
}

function loseGame(){
	animDealerKill();
	setTimeout(function() {
		displayPlayerDMG(player.hitPoints);
	}, 1000);
}

function winGame(){
	animPlayerKill();
	setTimeout(function() {
		displayDealerDMG(dealer.hitPoints);
	}, 1000);
}

function resetCardsOnTable(){
	$dealer_cards = $(".dCards").find('img');
	$player_cards = $(".pCards").find('img');
	
	$dealer_cards.hide(200);
	$player_cards.hide(200);
	
	//resets initial img to card back and resets rotation
	setTimeout(function(){
		$dealer_cards.attr('src', 'images/card-back.png');
		$dealer_cards.css({'transform':'rotateY(0deg)',
							  '-webkit-transform':'rotateY(0deg)'});
		$player_cards.attr('src', 'images/card-back.png');
		$player_cards.css({'transform':'rotateY(0deg)',
							  '-webkit-transform':'rotateY(0deg)'});
	},250);
}

function displayPlayerDMG(damage){
	$('#playerDMG').hide();
	$('#playerDMG').html(damage);
	
	//animates HP damage text
	$('#playerDMG').show(400, function(){
		player.hitPoints -= damage; //calculate new HP
		$('#playerCurrentHP').html(player.hitPoints); //update displayed HP
		setTimeout(function(){$('#playerDMG').hide(200)}, 500);
		});
}

function displayDealerDMG(damage){
	$('#dealerDMG').hide();
	$('#dealerDMG').html(damage);
	$('#dealerDMG').show(400, function(){
		dealer.hitPoints -= damage;
		$('#dealerCurrentHP').html(dealer.hitPoints); //update displayed HP
		setTimeout(function(){$('#dealerDMG').hide(200)}, 500);
		});
}