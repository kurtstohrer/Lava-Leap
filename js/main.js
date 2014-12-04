// blastem.js
// Dependencies: 
// Description: singleton object
// This object will be our main "controller" class and will contain references
// to most of the other objects in the game.

"use strict";

// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.keydown = [];

app.main = {
	// CONSTANT properties
    WIDTH : 1920 ,
    HEIGHT: 1080, 
	PLATFORM_DIFFERENCE: 200,
	dt: 1/60.0,
	aspectRatio: undefined,
    canvas: undefined,
    ctx: undefined,
	players: [],
	colors: ["green", "red", "blue", "purple"],
	platforms1: [],
	platforms2: [],
	platforms3: [],
	platformArrays: [],
	platformTypes: ["normal", "slow", "tramp", "moving", "sticky", "ghost"],
	startPlatform: undefined,
	gamestate: undefined,
	ticks: 0,
	speed: 150,
	drawLib:undefined,
	
	platformImage: undefined,
	backImage: undefined,
	gradients: [],
	imgIndex: 0,
	imgOpacityDown: 1.0,
	imgOpacityUp: 0.0,
	backSpeed:0,
	parallaxWallBack: undefined,
	parallaxWallFront: undefined,
	parallaxBackSpeed:0,
	parallaxFrontSpeed:0,
	backScrollIndex: 0,
	lavaImage: undefined,
	platformImages: [],
	TitleScreen: undefined,
	menuState: undefined,
	startButtonTick: 30,
	
	startTime: undefined,
	time: undefined,
	titleTick: 10,
	singleTick: 60,
	singleClock:0,
    
    // methods
	init : function() {
		// declare properties
		var c = document.createElement("canvas");
		document.body.appendChild(c);
		
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		this.ctx.textAlign = 'center';
		
		this.drawLib= app.drawLib;
		
		//get connected gamepads
		var pad = navigator.getGamepads();
		var numPlayers = 0;
		for(var i = 0; i < pad.length; i++)
		{
			if(pad[i] != undefined)
			{
				numPlayers += 1;
			}
		}
		if(numPlayers < 2) numPlayers = 2;
		
		//loop through and create a player for each gamepad
		for(var i = 0; i < numPlayers; i++)
		{
			this.players.push(new Player(this.WIDTH * (i+1)/(numPlayers+1), 500, this.colors[i], i));
		}
		
		/*for(var i = 2; i < numPlayers; i++){
			
			if(pad[i] != undefined){
			
				this.players.push(new Player(this.WIDTH * (i+1)/(numPlayers+!), 500, this.colors[i], i));
			}
		}*/
		this.TitleScreen = new Image();
		this.TitleScreen.src = "img/TITLESCREEN.jpg";
		
		this.platformImage = new Image();
		this.platformImage.src = "img/lavatile.png";
		
		this.backImage = new Image();
		this.backImage.src = "img/largewalltile-scaled.png";
		
		for(var i = 0; i < 4; i++){
		
			this.gradients.push(new Image());
		}
		
		this.gradients[0].src = "img/gradient_v1.jpg";
		this.gradients[1].src = "img/gradient_v2.jpg";
		this.gradients[2].src = "img/gradient_v3.jpg";
		this.gradients[3].src = "img/gradient_v4.jpg";
		
		this.parallaxWallBack = new Image();
		this.parallaxWallBack.src = "img/parallax wall back shaded.png";
		this.parallaxWallFront = new Image();
		this.parallaxWallFront.src = "img/parallax wall front shaded.png";
		
		this.lavaImage = new Image();
		this.lavaImage.src = "img/lava_mid.png";
		
		var platformImage = new Image();
		platformImage.src = "img/jumpirontile_animated.png";
		this.platformImages.push(platformImage);
		
		console.log(navigator.getGamepads());
		this.platformArrays.push(this.platforms1);
		this.platformArrays.push(this.platforms2);
		this.platformArrays.push(this.platforms3);
		for(var i = 0; i < this.platformArrays.length; i++)
		{
			var pwidth = 32 * Math.floor(Math.random() * 9 + 2);
			var px = Math.random() * (this.WIDTH - pwidth);
			this.platformArrays[i].push(new app.Platform(pwidth, px, this.platformImage, this.platformTypes[0]));
		}
		this.startPlatform = new app.Platform(this.WIDTH, 0, this.platformImage, this.platformTypes[0]);
		this.startPlatform.y = this.HEIGHT * 3/5;
			
		this.gamestate = "TITLE";
		this.menuState = 1;
		this.update();
	},
	
	reset: function(gamestate){
	
		this.players = [];
		this.platforms1 = [];
		this.platforms2 = [];
		this.platforms3 = [];
		this.platformArrays = [];
		this.ticks = 0;
		this.backSpeed = 0;
		this.speed = 150;
		this.singleTick = 60;
		this.singleClock = 0;
		
		
		//get connected gamepads
		var pad = navigator.getGamepads();
		var numPlayers = 0;
		for(var i = 0; i < pad.length; i++)
		{
			if(pad[i] != undefined)
			{
				numPlayers += 1;
			}
		}
		if(numPlayers < 2) numPlayers = 2;
		
		//loop through and create a player for each gamepad
		for(var i = 0; i < numPlayers; i++)
		{
			this.players.push(new Player(this.WIDTH * (i+1)/(numPlayers+1), 500, this.colors[i], i));
		}
		
		this.platformArrays.push(this.platforms1);
		this.platformArrays.push(this.platforms2);
		this.platformArrays.push(this.platforms3);
		for(var i = 0; i < this.platformArrays.length; i++)
		{
			var pwidth = 32 * Math.floor(Math.random() * 9 + 2);
			var px = Math.random() * (this.WIDTH - pwidth);
			this.platformArrays[i].push(new app.Platform(pwidth, px, this.platformImage, this.platformTypes[0]));
		}
		this.startPlatform = new app.Platform(this.WIDTH, 0, this.platformImage, this.platformTypes[0]);
		this.startPlatform.y = this.HEIGHT * 3/5;
			
		this.gamestate = gamestate;
		this.menuState = 1;
	},
		
	draw: function()
	{
		var width = this.WIDTH;
		var height = this.HEIGHT;
		var pad = navigator.getGamepads();
		
		if(this.gamestate == "TITLE"){
			
			this.ctx.drawImage(this.TitleScreen, 0, 0);
		
			if(this.menuState == 1){
				this.drawLib.alpharect(this.ctx,635,395,260,40,"#fff",0.2 );
			
			}
			if(this.menuState == 2){
				this.drawLib.alpharect(this.ctx,877,568,367,40,"#fff",0.2 );
			
			}
			if(this.menuState == 3){
				this.drawLib.alpharect(this.ctx,736,809,234,40,"#fff",0.2 );
			
			}
			
		}
		
		if(this.gamestate == "MAIN"){
		
			//player1
			if(pad[0] != undefined ){
				this.drawLib.outRect(this.ctx,0,0,width/4,height,'#063B08','#000F01');
				this.drawLib.text(this.ctx,'1',100,220,300,'#00E604');
			}
			else{
				this.drawLib.outRect(this.ctx,0,0,width/4,height,'#595959','#2E2E2E');
				this.drawLib.text(this.ctx,'1',100,220,300,'#878787');
				this.drawLib.rect(this.ctx, width/8 - 37.5, 450, 75, 75, '#878787');
				this.drawLib.rect(this.ctx, width/8 - 37.5, 526, 75, 75, '#878787');
				this.drawLib.rect(this.ctx, width/8 - 113.5, 526, 75, 75, '#878787');
				this.drawLib.rect(this.ctx, width/8 + 38.5, 526, 75, 75, '#878787');
				this.drawLib.text(this.ctx,'W',width/8,495,50,'#000000');
				this.drawLib.text(this.ctx,'Jump',width/8,515,20,'#000000');
				this.drawLib.text(this.ctx,'S',width/8,571,50,'#000000');
				this.drawLib.text(this.ctx,'A',width/8 - 76,571,50,'#000000');
				this.drawLib.text(this.ctx,'Left',width/8 - 76,591,20,'#000000');
				this.drawLib.text(this.ctx,'D',width/8 + 76,571,50,'#000000');
				this.drawLib.text(this.ctx,'Right',width/8 + 76,591,20,'#000000');
			}
			//player2
			if(pad[1] != undefined){
				this.drawLib.outRect(this.ctx,width/4,0,width/4,height,'#730000','#380D0D');
				this.drawLib.text(this.ctx,'2',width/4 +100,220,300,'#FF0000');
			}
			else{
				this.drawLib.outRect(this.ctx,width/4,0,width/4,height,'#595959','#2E2E2E');
				this.drawLib.text(this.ctx,'2',width/4 +100,220,300,'#878787');
				this.drawLib.rect(this.ctx, width*3/8 - 37.5, 450, 75, 75, '#878787');
				this.drawLib.rect(this.ctx, width*3/8 - 37.5, 526, 75, 75, '#878787');
				this.drawLib.rect(this.ctx, width*3/8 - 113.5, 526, 75, 75, '#878787');
				this.drawLib.rect(this.ctx, width*3/8 + 38.5, 526, 75, 75, '#878787');
				this.drawLib.text(this.ctx,'8',width*3/8,495,50,'#000000');
				this.drawLib.text(this.ctx,'Jump',width*3/8,515,20,'#000000');
				this.drawLib.text(this.ctx,'5',width*3/8,571,50,'#000000');
				this.drawLib.text(this.ctx,'4',width*3/8 - 76,571,50,'#000000');
				this.drawLib.text(this.ctx,'Left',width*3/8 - 76,591,20,'#000000');
				this.drawLib.text(this.ctx,'6',width*3/8 + 76,571,50,'#000000');
				this.drawLib.text(this.ctx,'Right',width*3/8 + 76,591,20,'#000000');
				this.drawLib.text(this.ctx,'(make sure NUM LOCK is on)',width*3/8,625,25,'#000000');
			}
			//player3
			if(pad[2] != undefined){
				this.drawLib.outRect(this.ctx,width/2,0,width/4,height,'blue','#000012');
				this.drawLib.text(this.ctx,'3',width/2 +100,220,300,'#5258F2');
			}
			else{
				this.drawLib.outRect(this.ctx,width/2,0,width/4,height,'#595959','#2E2E2E');
				this.drawLib.text(this.ctx,'3',width/2 +100,220,300,'#878787');
			} 
			//player4
			if(pad[3] != undefined){
				this.drawLib.outRect(this.ctx,width - width/4,0,width/4,height,'purple','#120011');
				this.drawLib.text(this.ctx,'4',width - width/4 +100,220,300,'#FA6EF8');
			}
			else{
				this.drawLib.outRect(this.ctx,width - width/4,0,width/4,height,'#595959','#2E2E2E');
				this.drawLib.text(this.ctx,'4',width - width/4 +100,220,300,'#878787');
			}
			
			if(pad[0] != undefined){
				this.drawLib.Shadowrect(this.ctx,0,height/2 + 100,width,100, '#fff');
				this.drawLib.text(this.ctx,"Press any button on your controller to join and  [p] or START to Play!",width/2, height/2 + 165, 45, '#000');
			}
			
		}
		if(this.gamestate == "GAME"){
			
			
			//this.ctx.save();
			//this.ctx.fillStyle = "white";
			//this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
			//this.ctx.restore();
			
			
			//BEGIN CHAD
			//background scrolling
			//if the background moves off screen, reset it
			if(this.backSpeed >= 1080){
				
				this.backSpeed = 0;
			}
			
			if(this.parallaxBackSpeed >= 1500){
				
				this.parallaxBackSpeed = 0;
			}
			
			if(this.parallaxFrontSpeed >= 1500){
				
				//this.backScrollIndex++;
				this.parallaxFrontSpeed = 0;
			}
			
			
			//END CHAD
			
			
			//update background pos
			this.backSpeed += this.speed * this.dt;
			this.parallaxBackSpeed += (this.speed+20) * this.dt;
			this.parallaxFrontSpeed += (this.speed+50) * this.dt;
			
			//draw backgrounds
			this.ctx.drawImage(this.backImage, 0, this.backSpeed - 1080);
			this.ctx.drawImage(this.backImage, 0, this.backSpeed);
			
			/*
			//stay between 1 and 0
			if(this.imgOpacityDown < 0){
				this.imgOpacityDown = 0;
				this.imgIndex++;
				this.imgSwitch = !this.imgSwitch;
			}
			else if(this.imgOpacityDown > 1){
				this.imgOpacityDown = 1;
				this.imgIndex++;
				this.imgSwitch = !this.imgSwitch;
			}
			
			if(this.imgOpacityUp > 1){
				this.imgOpacityUp = 1;
			}
			else if(this.imgOpacityUp < 0){
				this.imgOpacityUp = 0;
			}
			
			//if the direction is switched
			if(!this.imgSwitch){
			
				this.imgOpacityDown -= .001;
				this.imgOpacityUp += .001;
			}
			else{
				
				var temp = this.imgOpacityDown;
				
				this.imgOpacityDown = this.imgOpacityUp;
				this.imgOpacityUp = temp;
				this.imgSwitch = !this.imgSwitch;
			}
			
			//reset imgIndex
			if(this.imgIndex == 4){
				this.imgIndex =  0;
			}
			
			//draw the images in order {first image then second image
			this.ctx.save();
			this.ctx.globalAlpha = this.imgOpacityDown;
			this.ctx.drawImage(this.gradients[this.imgIndex], 0, 0);
			this.ctx.restore();
			
			this.ctx.save();
			this.ctx.globalAlpha = this.imgOpacityUp;
			
			//loop back to the first image if the above is the last image in the array
			if(this.imgIndex + 1 >= 4){
			
				this.ctx.drawImage(this.gradients[0], 0, 0);
			}
			else{
			
				this.ctx.drawImage(this.gradients[this.imgIndex + 1], 0, 0);
			}
			
			this.ctx.restore();
			*/
			
			if(this.startPlatform.active)
			{
				this.startPlatform.draw(this.ctx);
			}
			for(var j = 0; j < this.platformArrays.length; j++)
			{
				var platforms = this.platformArrays[j];
				for(var i = 0; i < platforms.length; i++)
				{
					platforms[i].draw(this.ctx, 1);
				}
			}
			
			
			
			
			//loop through and draw the players
			for(var i = 0; i < this.players.length; i++){
				
				this.players[i].draw(this.ctx);
			}
			for(var i = 0; i < 1920; i+=32){
			
				this.ctx.drawImage(this.lavaImage, i, this.HEIGHT-20);
			}
			
			this.ctx.drawImage(this.parallaxWallBack, 0, this.parallaxBackSpeed - 1500);
			this.ctx.drawImage(this.parallaxWallBack, 0, this.parallaxBackSpeed);
			this.ctx.drawImage(this.parallaxWallFront, 0, this.parallaxFrontSpeed - 1500);
			this.ctx.drawImage(this.parallaxWallFront, 0, this.parallaxFrontSpeed);
			
			this.ctx.save();
			this.ctx.scale(-1,1);
			this.ctx.drawImage(this.parallaxWallBack, -1920, this.parallaxBackSpeed - 1500);
			this.ctx.drawImage(this.parallaxWallBack, -1920, this.parallaxBackSpeed);
			this.ctx.drawImage(this.parallaxWallFront, -1920, this.parallaxFrontSpeed - 1500);
			this.ctx.drawImage(this.parallaxWallFront, -1920, this.parallaxFrontSpeed);
			this.ctx.restore();
		}
		if(this.gamestate == "SINGLE"){
			
			
			if(this.backSpeed >= 1080){
				
				this.backSpeed = 0;
			}
			
			if(this.parallaxBackSpeed >= 1500){
				
				this.parallaxBackSpeed = 0;
			}
			
			if(this.parallaxFrontSpeed >= 1500){
				
				//this.backScrollIndex++;
				this.parallaxFrontSpeed = 0;
			}
			
			
			//END CHAD
			
			
			//update background pos
			this.backSpeed += this.speed * this.dt;
			this.parallaxBackSpeed += (this.speed+20) * this.dt;
			this.parallaxFrontSpeed += (this.speed+50) * this.dt;
			
			//draw backgrounds
			this.ctx.drawImage(this.backImage, 0, this.backSpeed - 1080);
			this.ctx.drawImage(this.backImage, 0, this.backSpeed);
			
			
			if(this.startPlatform.active)
			{
				this.startPlatform.draw(this.ctx);
			}
			for(var j = 0; j < this.platformArrays.length; j++)
			{
				var platforms = this.platformArrays[j];
				for(var i = 0; i < platforms.length; i++)
				{
					platforms[i].draw(this.ctx, 1);
				}
			}
			
			
			
			
			
			
			//loop through and draw the players
			
				this.drawLib.text(this.ctx,this.singleClock,this.WIDTH/2, this.HEIGHT - 50, 50, '#fff');
				this.players[0].draw(this.ctx);
				for(var i = 0; i < 1920; i+=32){
			
				this.ctx.drawImage(this.lavaImage, i, this.HEIGHT-20);
			}
			
			this.ctx.drawImage(this.parallaxWallBack, 0, this.parallaxBackSpeed - 1500);
			this.ctx.drawImage(this.parallaxWallBack, 0, this.parallaxBackSpeed);
			this.ctx.drawImage(this.parallaxWallFront, 0, this.parallaxFrontSpeed - 1500);
			this.ctx.drawImage(this.parallaxWallFront, 0, this.parallaxFrontSpeed);
			
			this.ctx.save();
			this.ctx.scale(-1,1);
			this.ctx.drawImage(this.parallaxWallBack, -1920, this.parallaxBackSpeed - 1500);
			this.ctx.drawImage(this.parallaxWallBack, -1920, this.parallaxBackSpeed);
			this.ctx.drawImage(this.parallaxWallFront, -1920, this.parallaxFrontSpeed - 1500);
			this.ctx.drawImage(this.parallaxWallFront, -1920, this.parallaxFrontSpeed);
			this.ctx.restore();
			
		}
		if(this.gamestate == "END"){
		
			this.ctx.fillStyle = "#000";
			this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
			
			var numactive = 0;
			var winner = -1;
			for(var i = 0; i < this.players.length; i++)
			{
				if(this.players[i].active)
				{
					numactive+=1;
					winner = i;
				}
			}
			var winMess = "Player " + (winner + 1) + " Wins!";
			
			if(numactive == 1){
					this.drawLib.text(this.ctx,winMess,width/2, 300, 100, '#fff');
			}
			if(numactive == 0)
			{
				this.drawLib.text(this.ctx,"You're all bad at this!",width/2, 300, 100, '#fff');
			}
			
			this.drawLib.text(this.ctx,"Press [spacebar] or START to play again",width/2, 600, 80, '#fff');
			
			this.drawLib.text(this.ctx,"You lasted " + this.time + " seconds",width/2, 800, 50, '#fff');
		}
		if(this.gamestate == "SINGLEEND"){
		
			this.ctx.fillStyle = "#000";
			this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
			
			
			
			
			
			this.drawLib.text(this.ctx,"You Lasted: "+ this.singleClock + " seconds",width/2, 300, 100, '#fff');
			
			
			this.drawLib.text(this.ctx,"Press [spacebar] or START to play again",width/2, 600, 80, '#fff');
			
			
		}
	},
	
	checkCollosions: function()
	{
		for(var i = 0; i < this.players.length; i++)
		{
			var player = this.players[i];
			player.canJump =  false;
			for(var j = 0; j < this.platformArrays.length; j++)
			{
				var platforms = this.platformArrays[j];
				for(var k = 0; k < platforms.length; k++)
				{
					var platform = platforms[k];
					if(platform.type != "ghost" && player.y + player.height >= platform.y && player.prevy + player.height <= platform.y)
					{
						//console.log("110");
						var xdiff = player.x - player.prevx;
						var ydiff = player.y - player.prevy;
						var pct = (platform.y - player.prevy) / ydiff;
						//if((player.x + (pct * xdiff) >= platform.x && player.x + (pct * xdiff) <= platform.x + platform.width) ||
						//	(player.x + player.width + (pct * xdiff) >= platform.x && player.x + player.width + (pct * xdiff) <= platform.x + platform.width))
						if((player.x >= platform.x && player.x <= platform.x + platform.width) ||
							(player.x + player.width >= platform.x && player.x + player.width <= platform.x + platform.width))
						{
							//player.x = player.prevx + pct * xdiff;
							player.y = player.prevy - player.height + pct * ydiff;
							player.yVelocity = this.speed;
							if(platform.type != "sticky")
							{
								player.canJump = true;
								player.canHoldJump = true;
							}
							player.isOnPlatform(platform);
						}
					}
				}
			}
			if(this.startPlatform.active)
			{
				var platform = this.startPlatform;
				if(player.y + player.height >= platform.y && player.prevy + player.height <= platform.y)
				{
					var xdiff = player.x - player.prevx;
					var ydiff = player.y - player.prevy;
					var pct = (platform.y - player.prevy) / ydiff;
					//if((player.x + (pct * xdiff) >= platform.x && player.x + (pct * xdiff) <= platform.x + platform.width) ||
					//	(player.x + player.width + (pct * xdiff) >= platform.x && player.x + player.width + (pct * xdiff) <= platform.x + platform.width))
					if((player.x >= platform.x && player.x <= platform.x + platform.width) ||
						(player.x + player.width >= platform.x && player.x + player.width <= platform.x + platform.width))
					{
						//player.x = player.prevx + pct * xdiff;
						player.y = player.prevy - player.height + pct * ydiff;
						player.yVelocity = this.speed;
						player.canJump = true;
						player.canHoldJump = true;
						player.isOnPlatform(platform);
					}
				}
			}
			for(var j = 0; j < this.players.length; j++)
			{
				var player2 = this.players[j];
				if(player != player2)
				{
					if(player.y + player.height >= player2.y && player.prevy + player.height <= player2.prevy)
					{
						var xdiff = player.x - player.prevx;
						var ydiff = player.y - player.prevy;
						var pct = (player2.y - player.prevy) / ydiff;
						if((player.x >= player2.x && player.x <= player2.x + player2.width) ||
							(player.x + player.width >= player2.x && player.x + player.width <= player2.x + player2.width))
						{
							player.yVelocity = -800;
							player2.yVelocity = 800;
						}
					}
					if(player.x + player.width >= player2.x && player.prevx + player.width <= player2.prevx)
					{
						var xdiff = player.x - player.prevx;
						var ydiff = player.y - player.prevy;
						var pct = (player2.y - player.prevy) / ydiff;
						if((player.y >= player2.y && player.y <= player2.y + player2.height) ||
							(player.y + player.height >= player2.y && player.y + player.height <= player2.y + player2.height))
						{
							player.x = player2.x - player.width;
							player.xVelocity = 0;
							player2.xVelocity = 0;
						}
					}
				}
			}
		}
	},
	
	update: function()
	{
		requestAnimationFrame(this.update.bind(this));
		var pad = navigator.getGamepads();
		this.startButtonTick --;
		
		if(this.gamestate == "TITLE"){
		this.titleTick --;
			if(this.menuState > 3 ){
					this.menuState = 1;
					
			}
			if(this.menuState < 1 ){
					this.menuState = 3;
					
			}
			
			for(var i = 0; i < pad.length; i++)
			{
				if(pad[i] != undefined && ((pad[i].axes[1] > 0.2) || (pad[i].buttons[13].pressed))){
					if(this.titleTick <=0 ){
						this.menuState ++;
						this.titleTick = 15;
						console.log(this.menuState);
					}
					
				}
				if(pad[i] != undefined && ((pad[i].axes[1] < -0.2) || (pad[i].buttons[12].pressed))){
					if(this.titleTick <=0 ){
						this.menuState --;
						this.titleTick = 15;
					}
					
				}
				if(pad[i] != undefined && pad[i].buttons[9].pressed){
							if(this.menuState == 1){
								if(this.startButtonTick < 0 ){
									
									this.gamestate = "SINGLE";
									this.startButtonTick = 30;
								}
							}
							if(this.menuState == 2){
								
								if(this.startButtonTick < 0 ){
									this.gamestate = "MAIN";
									this.startButtonTick = 30;
								}
								
							}
							if(this.menuState == 3){
								
							}
					
				}
			}
			if(app.keydown[38]){
			if(this.titleTick <=0 ){
						this.menuState --;
						this.titleTick = 15;
					}
				
			}
			if(app.keydown[40]){
				if(this.titleTick <=0 ){
						this.menuState ++;
						this.titleTick = 15;
					}
				
			}
			if(app.keydown[13]){
				if(this.menuState == 1){
					this.gamestate = "SINGLE";
				}
				if(this.menuState == 2){
					this.gamestate = "MAIN";
					
				}
				if(this.menuState == 3){
					
				}
				
			}
		
		}
		
		if(this.gamestate == "MAIN"){
			if(app.keydown[80]){
			
				this.gamestate = "GAME";
				
				this.startTime = Date.now();
			}
			
			for(var i = 0; i < pad.length; i++)
			{
				if(pad[i] != undefined && pad[i].buttons[9].pressed){
					if(this.startButtonTick < 0 ){
						this.gamestate = "GAME";
						this.startButtonTick = 30;
					}
				}
			}
		
		}
		
		if(this.gamestate == "GAME" || this.gamestate == "SINGLE")
		{
			//loop through and update the players
			this.ticks++;
			this.time = (Date.now() - this.startTime) / 1000;
			for(var i = 0; i < this.players.length; i++){
				
				this.players[i].update(this.dt);
				while(this.players[i].y < 200)
				{
					for(var j = 0; j < this.players.length; j++)
					{
						this.players[j].y += 1;
					}
					for(var j = 0; j < this.platformArrays.length; j++)
					{
						var platforms = this.platformArrays[j];
						for(var k = 0; k < platforms.length; k++)
						{
							platforms[k].y += 1;
						}
					}
					if(this.startPlatform.active)
					{
						this.startPlatform.y += 1;
					}
					this.backSpeed += 1; 
				}
			}
		
			if(this.platforms1[0].y + this.PLATFORM_DIFFERENCE > this.startPlatform.y && this.startPlatform.active)
			{
				this.startPlatform.update(this.dt, this.speed);
			}

			for(var j = 0; j < this.platformArrays.length; j++)
			{
				var platforms = this.platformArrays[j];
				var highest = this.HEIGHT;
				var highestindex = 0;
				for(var i = 0; i < platforms.length; i++)
				{
					if(highest > platforms[i].y)
					{
						highest = platforms[i].y;
						highestindex = i;
					}
					platforms[i].update(this.dt, this.speed);
				}
				if(highest > this.PLATFORM_DIFFERENCE)//this.PLATFORM_DIFFERENCE = 200
				{
					var pwidth = 32 * Math.floor(Math.random() * 9 + 2);
					var px = Math.random() * 800 + platforms[highestindex].x - 400;
					var randType = Math.random();
					var typeIndex = 0;
					if(randType < 0.10)
					{
						typeIndex = 2;
					}
					else if(randType < 0.30)
					{
						typeIndex = 3;
					}
					else if(randType < 0.40)
					{
						typeIndex = 4;
					}
					else if(randType < 0.50)
					{
						typeIndex = 5;
					}
					if(px + pwidth > this.WIDTH)
					{
						var diff =  px + pwidth - this.WIDTH;
						px -= 2 * diff;
					}
					if(px < 0)
					{
						px = -px;
					}
					
					if(typeIndex == 2){
					
						platforms.push(new app.Platform(pwidth, px, this.platformImages[0], this.platformTypes[typeIndex]));
					}
					else platforms.push(new app.Platform(pwidth, px, this.platformImage, this.platformTypes[typeIndex]));
				}
				platforms = platforms.filter(function(platform)
				{
					return platform.active;
				});
			}
			//console.log(this.platforms1.length + " " + this.platforms2.length);
		}//END gamestate = "GAME"
		
		var numactive = 0;
		var winner = -1;
		for(var i = 0; i < this.players.length; i++)
		{
			if(this.players[i].active)
			{
				numactive+=1;
				winner = i;
			}
		}
		if(this.gamestate == "GAME"){
			if(numactive <= 1)
			{
				this.gamestate = "END";
			}
		}
		if(this.gamestate == "SINGLE"){
		
		this.singleTick --;
		if(this.singleTick <= 0 ){
			this.singleClock ++;
			this.singleTick = 60;
		}
			if(numactive <= 0)
			{
				this.gamestate = "SINGLEEND";
			}
		}
		
		if(this.gamestate == "END"){
			if(app.keydown[32]){
				this.reset("MAIN");
			}
						
			for(var i = 0; i < pad.length; i++)
			{
				if(pad[i] != undefined && pad[i].buttons[9].pressed){
					if(this.startButtonTick < 0 ){
						this.reset("MAIN");
						this.startButtonTick = 30;
					}
				}
			}
		
		}
		if(this.gamestate == "SINGLEEND"){
			if(app.keydown[32]){
				this.reset();
			}
						
			for(var i = 0; i < pad.length; i++)
			{
				if(pad[i] != undefined && pad[i].buttons[9].pressed){
					if(this.startButtonTick < 0 ){
						this.reset("TITLE");
						this.startButtonTick = 30;
					}
				}
			}
		
		}
		
		this.checkCollosions()
		this.draw();
	},
	
    
    
};

window.onload = function() {
	console.log("init called");
	
	window.addEventListener("keydown", function(e){
		//console.log("keydown " + e.keyCode);
		app.keydown[e.keyCode] = true;
	});
	
	window.addEventListener("keyup", function(e){
		//console.log("keyup");
		app.keydown[e.keyCode] = false;
	});
	
	app.main.init();
}
