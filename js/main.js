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
	playerImages: [],
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
	backImages: [],
	islandImage: undefined,
	gradients: [],
	imgIndex: 0,
	imgOpacityDown: 1.0,
	imgOpacityUp: 0.0,
	backSpeed:0,
	islandSpeed:0,
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
	fadeAlph: 1,
	fadeout: undefined,
	
	//instuction screen images
	insBackground: undefined,
	insIntro: undefined,
	insSingle: undefined,
	insMulti: undefined,
	insXcontrols: undefined,
	insKcontrols:undefined,
	insPlat:undefined,
	insStick: undefined,
	insTramp:undefined,
	insGhost:undefined,
	insState: undefined,
	insTick: 10,
	
	blueIdle: undefined,
	greenIdle:undefined,
	purpleIdle:undefined,
	tealIdle:undefined,
	greyIdle:undefined,
	charXCrop: undefined,
	mainAnimateTick: undefined,
	mainTickLength:undefined,
    
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
		
		
		//player images
		var playerColors = ["blue", "green", "purple", "cyan"];
		
		for(var i = 0; i < playerColors.length; i++){
		
			var images = [];
			
			var image = new Image();
			image.src = "img/" + playerColors[i] + "_character_idle.png";
			images.push(image);
			
			image = new Image();
			image.src = "img/" + playerColors[i] + "_running_v2.png";
			images.push(image);
			
			image = new Image();
			image.src = "img/" + playerColors[i] + "_character_jumping.png";
			images.push(image);
			
			image = new Image();
			image.src = "img/" + playerColors[i] + "_character_falling.png";
			images.push(image);
			
			this.playerImages.push(images);
		}
		
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
		for(var i = 0; i < numPlayers; i++){
		
			this.players.push(new Player(this.WIDTH * (i+1)/(numPlayers+1), 500, this.playerImages[i], i));
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
		
		this.islandImage = new Image();
		this.islandImage.src = "img/parrallax_background_background.png";
		
		for(var i = 0; i < 4; i++){
		
			this.backImages.push(new Image());
		}
		
		this.backImages[0].src = "img/largewalltile-scaled.png";
		this.backImages[1].src = "img/largewalltile-scaled-v2.png";
		this.backImages[2].src = "img/largewalltile-scaled-v3.png";
		this.backImages[3].src = "img/parrallax_background_foreground.png";
		
		console.log(this.backImages);
		for(var i = 0; i < 4; i++){
		
			this.gradients.push(new Image());
		}
		
		this.gradients[0].src = "img/gradient_v1.png";
		this.gradients[1].src = "img/gradient_v2.png";
		this.gradients[2].src = "img/gradient_v3.png";
		this.gradients[3].src = "img/gradient_v4.png";
		
		this.parallaxWallBack = new Image();
		this.parallaxWallBack.src = "img/parallax wall back shaded.png";
		this.parallaxWallFront = new Image();
		this.parallaxWallFront.src = "img/parallax wall front shaded.png";
		
		this.lavaImage = new Image();
		this.lavaImage.src = "img/lava_mid.png";
		
		this.loadImgs();
		
		//tramp tile
		var platformImage = new Image();
		platformImage.src = "img/jumpirontile_animated_v2.png";
		this.platformImages.push(platformImage);
		
		//sticky tile
		platformImage = new Image();
		platformImage.src = "img/stickytile_vanishing_animated.png";
		this.platformImages.push(platformImage);
		
		//ghost tile
		platformImage = new Image();
		platformImage.src = "img/ghosttile.png";
		this.platformImages.push(platformImage);
		
		
		platformImage = new Image();
		platformImage.src = "img/ghosttile vanishing.png";
		this.platformImages.push(platformImage);
		
		//moving tiles
		platformImage = new Image();
		platformImage.src = "img/wallfurrow.png";
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
		
		this.fadeout = "TRUE";
		
		this.gamestate = "TITLE";
		this.menuState = 1;
		this.insState = 1;
		this.charXCrop = 0;
		this.mainTickLength = 15;
		this.mainAnimateTick = this.mainTickLength;
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
			this.players.push(new Player(this.WIDTH * (i+1)/(numPlayers+1), 500, this.playerImages[i], i));
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
		this.insState = 1;
		this.charXCrop = 0;
	},
		
	draw: function()
	{
		var width = this.WIDTH;
		var height = this.HEIGHT;
		var pad = navigator.getGamepads();
		
		if(this.gamestate == "TITLE"){
			
		var titleAlpha = .7;	
			this.ctx.drawImage(this.TitleScreen, 0, 0);
		
			if(this.menuState == 1){
				
				this.drawLib.alpharect(this.ctx,654,252,399,58,"#e86c1a",titleAlpha );
			}
			if(this.menuState == 2){
				this.drawLib.alpharect(this.ctx,864,471,359,58,"#e86c1a",titleAlpha );
			
			}
			if(this.menuState == 3){
				
				
				this.drawLib.alpharect(this.ctx,649,672,387,57,"#e86c1a",titleAlpha);
			
			}
			if(this.menuState == 4){
				this.drawLib.alpharect(this.ctx,984,873,286,58,"#e86c1a",titleAlpha );
			}
			
			if(pad[0] != undefined ){
				this.drawLib.fadeText(this.ctx,'Use the Analog Stick or D-pad to Navigate and press A or START to select ',width/2,40,25,'#fff',this.fadeAlph);
			}
			else{
				this.drawLib.fadeText(this.ctx,'Use the arrow keys to navigate and press [enter] to select',width/2,40,25,'#fff',this.fadeAlph);
			}
			
		}
		
		if(this.gamestate == "MAIN"){
			
			var charSize= 256;
			var charY= 385;
			
			
			//player1
			if(pad[0] != undefined ){
				this.drawLib.outRect(this.ctx,0,0,width/4,height,'#97a5d1','#1c3170');
				this.drawLib.text(this.ctx,'1',100,270,300,'#1c3170');
				this.ctx.drawImage(this.blueIdle, //image
						this.charXCrop, //x of the sprite sheet
						0,// y of the sprite sheet
						256, // width of the crop
						256, // height of the crop
						125, // x coord of where to draw
						charY, // y coord of where to draw
						charSize, // width to draw the image
						charSize);
						
			}
			else{
				this.drawLib.outRect(this.ctx,0,0,width/4,height,'#595959','#2E2E2E');
				this.drawLib.text(this.ctx,'1',100,270,300,'#878787');
				this.drawLib.rect(this.ctx, width/8 - 37.5, 850, 75, 75, '#878787');
				this.drawLib.rect(this.ctx, width/8 - 37.5, 926, 75, 75, '#878787');
				this.drawLib.rect(this.ctx, width/8 - 113.5, 926, 75, 75, '#878787');
				this.drawLib.rect(this.ctx, width/8 + 38.5, 926, 75, 75, '#878787');
				this.drawLib.text(this.ctx,'W',width/8,895,50,'#000000');
				this.drawLib.text(this.ctx,'Jump',width/8,915,20,'#000000');
				this.drawLib.text(this.ctx,'S',width/8,971,50,'#000000');
				this.drawLib.text(this.ctx,'A',width/8 - 76,971,50,'#000000');
				this.drawLib.text(this.ctx,'Left',width/8 - 76,991,20,'#000000');
				this.drawLib.text(this.ctx,'D',width/8 + 76,971,50,'#000000');
				this.drawLib.text(this.ctx,'Right',width/8 + 76,991,20,'#000000');
				this.ctx.drawImage(this.greyIdle, //image
						this.charXCrop, //x of the sprite sheet
						0,// y of the sprite sheet
						256, // width of the crop
						256, // height of the crop
						125, // x coord of where to draw
						charY, // y coord of where to draw
						charSize, // width to draw the image
						charSize);
			}
			//player2
			if(pad[1] != undefined){
				this.drawLib.outRect(this.ctx,width/4,0,width/4,height,'#69ab70','#16511c');
				this.drawLib.text(this.ctx,'2',width/4 +100,270,300,'#16511c');
					this.ctx.drawImage(this.greenIdle, //image
						this.charXCrop, //x of the sprite sheet
						0,// y of the sprite sheet
						256, // width of the crop
						256, // height of the crop
						width/4 + 125, // x coord of where to draw
						charY, // y coord of where to draw
						charSize, // width to draw the image
						charSize);
			}
			else{
				this.drawLib.outRect(this.ctx,width/4,0,width/4,height,'#595959','#2E2E2E');
				this.drawLib.text(this.ctx,'2',width/4 +100,270,300,'#878787');
				this.drawLib.rect(this.ctx, width*3/8 - 37.5, 850, 75, 75, '#878787');
				this.drawLib.rect(this.ctx, width*3/8 - 37.5, 926, 75, 75, '#878787');
				this.drawLib.rect(this.ctx, width*3/8 - 113.5, 926, 75, 75, '#878787');
				this.drawLib.rect(this.ctx, width*3/8 + 38.5, 926, 75, 75, '#878787');
				this.drawLib.text(this.ctx,'8',width*3/8,895,50,'#000000');
				this.drawLib.text(this.ctx,'Jump',width*3/8,915,20,'#000000');
				this.drawLib.text(this.ctx,'5',width*3/8,971,50,'#000000');
				this.drawLib.text(this.ctx,'4',width*3/8 - 76,971,50,'#000000');
				this.drawLib.text(this.ctx,'Left',width*3/8 - 76,991,20,'#000000');
				this.drawLib.text(this.ctx,'6',width*3/8 + 76,971,50,'#000000');
				this.drawLib.text(this.ctx,'Right',width*3/8 + 76,991,20,'#000000');
				this.drawLib.text(this.ctx,'(make sure NUM LOCK is on)',width*3/8,1025,25,'#000000');
				//this.drawLib.text(this.ctx,'2',width/4 +100,470,300,'#16511c');
					this.ctx.drawImage(this.greyIdle, //image
						this.charXCrop, //x of the sprite sheet
						0,// y of the sprite sheet
						256, // width of the crop
						256, // height of the crop
						width/4 + 125, // x coord of where to draw
						charY, // y coord of where to draw
						charSize, // width to draw the image
						charSize);
			}
			//player3
			if(pad[2] != undefined){
				this.drawLib.outRect(this.ctx,width/2,0,width/4,height,'#9e7cd4','#3f2072');
				this.drawLib.text(this.ctx,'3',width/2 +100,270,300,'#3f2072');
				this.ctx.drawImage(this.greenIdle, //image
						this.charXCrop, //x of the sprite sheet
						0,// y of the sprite sheet
						256, // width of the crop
						256, // height of the crop
						width/2 + 125, // x coord of where to draw
						charY, // y coord of where to draw
						charSize, // width to draw the image
						charSize);
			}
			else{
				this.drawLib.outRect(this.ctx,width/2,0,width/4,height,'#595959','#2E2E2E');
				this.drawLib.text(this.ctx,'3',width/2 +100,270,300,'#878787');
				this.ctx.drawImage(this.greyIdle, //image
						this.charXCrop, //x of the sprite sheet
						0,// y of the sprite sheet
						256, // width of the crop
						256, // height of the crop
						width/2 + 125, // x coord of where to draw
						charY, // y coord of where to draw
						charSize, // width to draw the image
						charSize);
			} 
			//player4
			if(pad[3] != undefined){
				this.drawLib.outRect(this.ctx,width - width/4,0,width/4,height,'#73cfc1','#137264');
				this.drawLib.text(this.ctx,'4',width - width/4 +100,270,300,'#137264');
				this.ctx.drawImage(this.tealIdle, //image
						this.charXCrop, //x of the sprite sheet
						0,// y of the sprite sheet
						256, // width of the crop
						256, // height of the crop
						width - width/4 + 125, // x coord of where to draw
						charY, // y coord of where to draw
						charSize, // width to draw the image
						charSize);
			}
			else{
				this.drawLib.outRect(this.ctx,width - width/4,0,width/4,height,'#595959','#2E2E2E');
				this.drawLib.text(this.ctx,'4',width - width/4 +100,270,300,'#878787');
				this.ctx.drawImage(this.greyIdle, //image
						this.charXCrop, //x of the sprite sheet
						0,// y of the sprite sheet
						256, // width of the crop
						256, // height of the crop
						width - width/4 + 125, // x coord of where to draw
						charY, // y coord of where to draw
						charSize, // width to draw the image
						charSize);
			}
			
			if(pad[0] != undefined){
				this.drawLib.Shadowrect(this.ctx,0,height/2 + 100,width,100, '#fff');
				this.drawLib.text(this.ctx,"Press any button on your controller to join and  [p] or START to Play!",width/2, height/2 + 165, 45, '#000');
			}
			
			if(pad[0] != undefined ){
				this.drawLib.fadeText(this.ctx,'Press B to return to the main',width/2,40,25,'#fff',this.fadeAlph);
			}
			else{
				this.drawLib.fadeText(this.ctx,'Press [backspace] to return to the main menu',width/2,40,25,'#fff',this.fadeAlph);
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
			if(this.backSpeed >= 1080*4){
				
				this.backSpeed = 0;
			}
			
			if(this.parallaxBackSpeed >= 1500){
				
				this.parallaxBackSpeed = 0;
			}
			
			if(this.parallaxFrontSpeed >= 1500){
				
				this.parallaxFrontSpeed = 0;
			}
			
			if(this.islandSpeed >= 1080){
				
				this.islandSpeed = 0;
			}
			
			//END CHAD
			
			
			//update background pos
			this.backSpeed += this.speed * this.dt;
			this.parallaxBackSpeed += (this.speed+20) * this.dt;
			this.parallaxFrontSpeed += (this.speed+50) * this.dt;
			this.islandSpeed += (this.speed-45) * this.dt;
			
			//draw backgrounds
			if(this.backSpeed >= 1080 * 2){
			
				this.ctx.drawImage(this.islandImage, 1000, this.islandSpeed-1080);
				this.ctx.drawImage(this.islandImage, 1000, this.islandSpeed);
			}
			this.ctx.drawImage(this.backImages[0], 0, this.backSpeed - (1080 * 4));
			this.ctx.drawImage(this.backImages[3], 0, this.backSpeed - (1080 * 3));
			this.ctx.drawImage(this.backImages[2], 0, this.backSpeed - (1080 * 2));
			this.ctx.drawImage(this.backImages[1], 0, this.backSpeed - 1080);
			this.ctx.drawImage(this.backImages[0], 0, this.backSpeed);
			
			/* gradient bakcground
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
			
			
			if(this.backSpeed >= 1080 * 4){
				
				this.backSpeed = 0;
			}
			
			if(this.parallaxBackSpeed >= 1500){
				
				this.parallaxBackSpeed = 0;
			}
			
			if(this.parallaxFrontSpeed >= 1500){
				
				this.parallaxFrontSpeed = 0;
			}
			
			if(this.islandSpeed >= 1080){
				
				this.islandSpeed = 0;
			}
			
			//END CHAD
			
			
			//update background pos
			this.backSpeed += this.speed * this.dt;
			this.parallaxBackSpeed += (this.speed+20) * this.dt;
			this.parallaxFrontSpeed += (this.speed+50) * this.dt;
			this.islandSpeed += (this.speed-45) * this.dt;
			
			//draw backgrounds
			if(this.backSpeed >= 1080 * 2){
			
				this.ctx.drawImage(this.islandImage, 1000, this.islandSpeed-1080);
				this.ctx.drawImage(this.islandImage, 1000, this.islandSpeed);
			}
			this.ctx.drawImage(this.backImages[0], 0, this.backSpeed - (1080 * 4));
			this.ctx.drawImage(this.backImages[3], 0, this.backSpeed - (1080 * 3));
			this.ctx.drawImage(this.backImages[2], 0, this.backSpeed - (1080 * 2));
			this.ctx.drawImage(this.backImages[1], 0, this.backSpeed - 1080);
			this.ctx.drawImage(this.backImages[0], 0, this.backSpeed);
			
			/* gradient bakcground 
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
			else if(this.imgOpacityUp < 0a){
				this.imgOpacityUp = 0;
			}
			
			//if the direction is switched
			if(!this.imgSwitch){
			
				this.imgOpacityDown -= .015;
				this.imgOpacityUp += .015;
			}
			else{
				
				var temp = this.imgOpacityDown;
				
				this.imgOpacityDown = this.imgOpacityUp;
				this.imgOpacityUp = temp;
				this.imgSwitch = !this.imgSwitch;
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
			
				//this.ctx.drawImage(this.gradients[0], 0, 0);
				this.imgIndex = 0;
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
		if(this.gamestate == "INS"){
		this.drawINS();
		}
	},
	drawINS: function(){
	
		
			var selectAlpha = 0.7;	
			var width = this.WIDTH;
			var height = this.HEIGHT;
			var pad = navigator.getGamepads();
			
			this.ctx.drawImage(this.insBackground, 0, 0);
		
			if(this.insState == 1){
					//intro
					this.drawLib.alpharect(this.ctx,110,142,451,85,"#e86c1a",selectAlpha );
					this.ctx.drawImage(this.insIntro, 800, 196,1000,714);
		
			}
			if(this.insState == 2){
					//singleplayer
					this.drawLib.alpharect(this.ctx,110,255,451,85,"#e86c1a",selectAlpha );
					this.ctx.drawImage(this.insSingle, 800, 196,1000,714);
			}
			if(this.insState == 3){
				//multiplayer
					this.drawLib.alpharect(this.ctx,110,367,451,85,"#e86c1a",selectAlpha );
					this.ctx.drawImage(this.insMulti, 800, 196,1000,714);
			}
			if(this.insState == 4){
				//platforms
					this.drawLib.alpharect(this.ctx,110,480,451,85,"#e86c1a",selectAlpha );
					this.ctx.drawImage(this.insPlat, 800, 196,1000,714);
			}
			if(this.insState == 5){
				//bouncy	
					this.drawLib.alpharect(this.ctx,110,590,451,85,"#e86c1a",selectAlpha );
					this.ctx.drawImage(this.insTramp, 800, 196,1000,714);
			}
			if(this.insState == 6){
				//ghost
					this.drawLib.alpharect(this.ctx,110,703,451,85,"#e86c1a",selectAlpha );
					this.ctx.drawImage(this.insGhost, 800, 196,1000,714);
			}
			if(this.insState == 7){
				//sticky	
					this.drawLib.alpharect(this.ctx,110,815,451,85,"#e86c1a",selectAlpha );
					this.ctx.drawImage(this.insStick, 800, 196,1000,714);
			}
			if(this.insState == 8){
				//controls	
					this.drawLib.alpharect(this.ctx,110,928,451,85,"#e86c1a",selectAlpha );
					if(pad[0] != undefined ){
					this.ctx.drawImage(this.insXcontrols, 800, 196,1000,714);
					}
					else{
						this.ctx.drawImage(this.insKcontrols, 800, 196,1000,714);
					
					}
					
			}
			if(pad[0] != undefined ){
				this.drawLib.fadeText(this.ctx,'Press B to return to the main menu',width - 300,40,25,'#fff',this.fadeAlph);
			}
			else{
				this.drawLib.fadeText(this.ctx,'Press [backspace] to return to the main menu',width- 400,40,25,'#fff',this.fadeAlph);
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
							player.falling = false;
							if(!platform.sticky)
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
						player.falling = false;
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
		
		if(this.fadeout == "TRUE"){
			this.fadeAlph -= .01;
		}
		if(this.fadeout == "FALSE"){
			this.fadeAlph += .01;
		}
		if(this.fadeAlph < 0.1 ){
			this.fadeout = "FALSE";
		
		}
		if(this.fadeAlph >= 1){
			this.fadeout = "TRUE";
		}
		
		
		if(this.gamestate == "TITLE"){
		this.titleTick --;
		var makeSound = false;
		
			if(this.menuState > 4 ){
					this.menuState = 1;
					
			}
			if(this.menuState < 1 ){
					this.menuState = 4;
					
			}
			
			for(var i = 0; i < pad.length; i++)
			{
				if(pad[i] != undefined && ((pad[i].axes[1] > 0.2) || (pad[i].buttons[13].pressed))){
					if(this.titleTick <=0 ){
						this.menuState ++;
						this.titleTick = 15;
						console.log(this.menuState);
						makeSound=true;
					}
					
				}
				if(pad[i] != undefined && ((pad[i].axes[1] < -0.2) || (pad[i].buttons[12].pressed))){
					if(this.titleTick <=0 ){
						this.menuState --;
						this.titleTick = 15;
						makeSound=true;
					}
					
				}
				if(pad[i] != undefined && pad[i].buttons[9].pressed || pad[i] != undefined && pad[i].buttons[0].pressed ){
							if(this.menuState == 1){
								if(this.startButtonTick < 0 ){
									
									this.gamestate = "SINGLE";
									this.startTime = Date.now();
									this.startButtonTick = 30;
									makeSound=true;
								}
							}
							if(this.menuState == 2){
								
								if(this.startButtonTick < 0 ){
									this.gamestate = "MAIN";
									this.startButtonTick = 30;
									makeSound=true;
								}
								
							}
							if(this.menuState == 3){
								
								if(this.startButtonTick < 0 ){
									this.gamestate = "INS";
									this.startButtonTick = 30;
									makeSound=true;
								}
							}
					
				}
			}
			if(app.keydown[38]){
			if(this.titleTick <=0 ){
						this.menuState --;
						this.titleTick = 15;
						makeSound=true;
					}
				
			}
			if(app.keydown[40]){
				if(this.titleTick <=0 ){
						this.menuState ++;
						this.titleTick = 15;
						makeSound=true;
					}
				
			}
			if(app.keydown[13]){
				makeSound=true;
				if(this.menuState == 1){
					this.gamestate = "SINGLE";
					this.startTime = Date.now();
				}
				if(this.menuState == 2){
					this.gamestate = "MAIN";
					
				}
				if(this.menuState == 3){
					this.gamestate = "INS";
				}
				
			}
		
		}
		
		if(this.gamestate == "MAIN"){
			this.mainAnimateTick --;
			
			if(this.mainAnimateTick <= 0 ){
				this.charXCrop += 256;
				this.mainAnimateTick += this.mainTickLength;
			
			}
			if(this.charXCrop >= 1024){
				this.charXCrop = 0;
			
			}
			
			
			if(app.keydown[80]){
			
				this.gamestate = "GAME";
				makeSound=true;
				this.startTime = Date.now();
			}
			
			for(var i = 0; i < pad.length; i++)
			{
				if(pad[i] != undefined && pad[i].buttons[9].pressed){
					if(this.startButtonTick < 0 ){
						this.gamestate = "GAME";
						this.startTime = Date.now();
						this.startButtonTick = 30;
						makeSound=true;
					}
				}
			}
			for(var i = 0; i < pad.length; i++){
				if(pad[i] != undefined && pad[i].buttons[1].pressed){
					if(this.startButtonTick < 0 ){
						this.reset("TITLE");
						this.startButtonTick = 30;
						
					}
				}
			}
			if(app.keydown[8]){
			
				if(this.startButtonTick < 0 ){
						this.reset("TITLE");
						this.startButtonTick = 30;
						
					}
		}
		}
		
		if(makeSound){
			var sfx = new Audio("sfx.mp3");
			sfx.volume = 0.4;
			//sfx.play();
		}
		
		if(this.gamestate == "GAME" || this.gamestate == "SINGLE")
		{
			//loop through and update the players
			this.ticks++;
			this.time = (Date.now() - this.startTime) / 1000;
			//console.log(this.speed);
			this.speed = 150 + this.time;// * 0.5;
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
					
					//platform images
					//0:normal 1:sticky 2:ghost 3:moving
					if(typeIndex == 2){
					
						platforms.push(new app.Platform(pwidth, px, this.platformImages[0], this.platformTypes[typeIndex]));
					}
					else if(typeIndex == 4){

						platforms.push(new app.Platform(pwidth, px, this.platformImages[1], this.platformTypes[typeIndex]));
					}
					else if(typeIndex == 5){
					
						platforms.push(new app.Platform(pwidth, px, this.platformImages[2], this.platformTypes[typeIndex]));
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
		
		if(this.gamestate == "INS"){
		this.insTick --;
		var makeSound = false;
		
			if(this.insState > 8 ){
					this.insState = 1;
					
			}
			if(this.insState < 1 ){
					this.insState = 8;
					
			}
			
			for(var i = 0; i < pad.length; i++)
			{
				if(pad[i] != undefined && ((pad[i].axes[1] > 0.2) || (pad[i].buttons[13].pressed))){
					if(this.insTick <=0 ){
						this.insState ++;
						this.insTick = 15;
						console.log(this.insState);
						makeSound=true;
					}
					
				}
				if(pad[i] != undefined && ((pad[i].axes[1] < -0.2) || (pad[i].buttons[12].pressed))){
					if(this.insTick <=0 ){
						this.insState --;
						this.insTick = 15;
						makeSound=true;
					}
					
				}
				if(pad[i] != undefined && pad[i].buttons[1].pressed){
					if(this.startButtonTick < 0 ){
						this.reset("TITLE");
						this.startButtonTick = 30;
						
					}
				}
		
			}
			if(app.keydown[38]){
			if(this.insTick <=0 ){
						this.insState --;
						this.insTick = 15;
						makeSound=true;
					}
				
			}
			if(app.keydown[40]){
				if(this.insTick <=0 ){
						this.insState ++;
						this.insTick = 15;
						makeSound=true;
					}
				
			}
			if(app.keydown[8]){
			
				if(this.startButtonTick < 0 ){
						this.reset("TITLE");
						this.startButtonTick = 30;
						
					}
		}
			
		
		}
		
		this.checkCollosions()
		this.draw();
	},
	
	loadImgs: function(){
	
	//instructions
		this.insBackground = new Image();
		this.insBackground.src = "img/instructions/INS.jpg";
		
		this.insIntro= new Image();
		this.insIntro.src = "img/instructions/intro.png";
		
		this.insSingle = new Image();
		this.insSingle.src = "img/instructions/singleplayer.png";
		
		this.insMulti= new Image();
		this.insMulti.src = "img/instructions/multiplayer.png";
		
		this.insXcontrols = new Image();
		this.insXcontrols.src = "img/instructions/controls.png";
		
		this.insKcontrols = new Image();
		this.insKcontrols.src = "img/instructions/keycontrols.png";
		
	   this. insPlat = new Image();
		this.insPlat.src = "img/instructions/normPlat.png";
		
	   this. insStick = new Image();
		this.insStick.src = "img/instructions/stickyPlat.png";
		
		this.insTramp= new Image();
		this.insTramp.src = "img/instructions/trampPlat.png";
		
		this.insGhost = new Image();
		this.insGhost.src = "img/instructions/ghostPlat.png";
	
	//large Idle for select screen\
	
		this.blueIdle = new Image();
		this.blueIdle.src = "img/multiplayer/blueIdleXL.png";
		
		this.greenIdle = new Image();
		this.greenIdle.src = "img/multiplayer/greenIdleXL.png";
		
		this.purpleIdle = new Image();
		this.purpleIdle.src = "img/multiplayer/purpleIdleXL.png";
		
		this.tealIdle = new Image();
		this.tealIdle.src = "img/multiplayer/tealIdleXL.png";
		
		this.greyIdle = new Image();
		this.greyIdle.src = "img/multiplayer/greyIdleXL.png";
	},
	
    
    
};

window.onload = function() {
	console.log("init called");
	
	var audio = new Audio("thefloorislava.mp3");
	audio.loop = true;
	//audio.play();
	
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
