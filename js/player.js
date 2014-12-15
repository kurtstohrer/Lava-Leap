"use strict"

//player class
//needs x,y coords, a color (will be replaced by image), and the controller number
var Player = function Player(x, y, images, controls){

	//variables
	this.x = x;
	this.y = y;
	this.prevx = this.x;
	this.prevy = this.y;
	this.images = images;
	this.acceleration = 20;
	this.xVelocity = 2;
	this.yVelocity = 10;
	this.maxVelocity = 6;
	this.controller = controls;
	this.gravity = 40;
	this.ground = 300;
	this.width = 32;
	this.height = 32;
	this.canJump = false;
	this.canHoldJump = false;
	this.active = true;
	this.platform = null;
	
	//for animation
	this.imgIndex = 0;
	
	this.ticsPerFrame = 15;
	this.tics = 0;
	
	this.idle = false;
	this.runningLeft = false;
	this.runningRight = false;
	this.jumping = false;
	this.falling = false;
	this.flipped = false;
}

//update
Player.prototype.update = function update(dt)
{
	if(this.active)
	{
		this.prevx = this.x;
		this.prevy = this.y;
		
		//grab this players controller
		var pad = navigator.getGamepads()[this.controller];
		

		
		var jump;
		var left;
		var right;
		var run;
		var start;
		//if it is not undefined
		if(pad != undefined)
		{
			//assign button values to save typing time
			jump = pad.buttons[0].pressed; //A button
			run = pad.buttons[2].pressed; // X button
			left = ((pad.axes[0] < -0.2) || (pad.buttons[14].pressed));//left stick left or dpad left
			right = ((pad.axes[0] > 0.2) || (pad.buttons[15].pressed));//left stick right or dpad right
			start = pad.buttons[8].pressed;// Start Button
			//var leftStickX = pad.axes[0];
			//var dPadLeft = pad.buttons[14];
			//var dPadRight = pad.buttons[15];
		}
		else if (this.controller == 0)
		{
			jump = app.keydown[87];//W
			run = app.keydown[32];//SPACE
			left = app.keydown[65];//A
			right = app.keydown[68];//D
		}
		else if (this.controller == 1){
		
			jump = app.keydown[104];//NUMPAD 8
			run = app.keydown[13];//NUMPAD ENTER
			left = app.keydown[100];//NUMPAD 4
			right = app.keydown[102];//NUMPAD 6
			start = app.keydown[80]; // P
		}
		
		//EDIT - CHAD
		//added control based on what platform the player is currently on
		
		if(jump){
		
			this.jumping = true;
			this.runningLeft = false;
			this.runningRight = false;
			this.falling = true;
			this.idle = false;
			this.imgIndex = 0;
		}
		else {
		
			this.jumping = false;
		}
			
		if(this.platform && this.platform.type == "tramp" && this.canJump){
		
			this.yVelocity = Math.sqrt(this.y - 200) * -65;
			this.canJump = false;
			this.jumping = true;
			this.canHoldJump = false;
		}
		
		//if the A button is pressed
		else if(jump && this.canHoldJump){
		
			
			if(this.canJump){
			
				this.yVelocity = -900;
			}
			else{
			
				this.yVelocity -= this.gravity - 30;
			}
			//EDIT - CHAD
			//reset platform type when players jump to resume normal movement
			this.platform = null;
		}
		else{
		
			this.canHoldJump = false;
		}
		
		//if the left D-pad is pressed of the left stick moved left, go left and limit the speed
		if(left){
			
			this.flipped = true;
			
			if(!this.jumping){
			
				this.runningLeft = true;
			}
			this.idle = false;
			this.ticsPerFrame = 5;
			
			if(this.platform && this.platform.type == "slow"){
				
				this.x -= 160 * dt;
			}
			else if (!this.platform || (this.platform && !this.platform.sticky))
			{				
				this.x -= 480 * dt;
			}
		}
		else{
		
			this.runningLeft = false;
		}
		
		//if the righ D-pad is pressed of the left stick moved right, go right and limit the speed
		if(right){
			
			this.flipped = false;
			
			if(!this.jumping){
			
				this.runningRight = true;
			}
			this.idle = false;
			this.ticsPerFrame = 5;
			
			if(this.platform && this.platform.type == "slow")
			{
				this.x += 160 * dt;
			}
			else if (!this.platform || (this.platform && !this.platform.sticky))
			{				
				this.x += 480 * dt;
			}
		}
		else{
		
			this.runningRight = false;
		}
		
		if(this.platform && this.platform.type == "moving")
		{
			this.x += this.platform.xVelocity * dt;
		}
		
		if(this.x < 0)
		{
			this.x = 0;
		}
		if(this.x > 1920 - this.height)
		{
			this.x = 1920 - this.height
		}
		
		if(!this.runningLeft && !this.runningRight && !this.jumping && !this.falling){
		
			this.idle = true;
			this.ticsPerFrame = 15;
			//console.log(this.imgIndex);
			
			if(this.imgIndex >= 3){
			
				this.imgIndex = 0;
			}
		}
		//console.log("idle: " + this.idle + " runningRight: " + this.runningRight + " runningLeft: " + this.runningLeft + " jumping: " + this.jumping + " falling: " + this.falling);
		
		this.yVelocity += this.gravity;
		this.y += this.yVelocity * dt;
		if(this.y > 1080) this.active = false;
	}
};

//draw
Player.prototype.draw = function draw(ctx)
{
	var width = 32;
	var height = 32;
	
	if(this.active)
	{
		//draw a square place-holder for the player location
		
		this.animate();
		
		for(var i = 0; i < this.width; i+=32){
				
			ctx.save();
			
			if(this.flipped){
				
				ctx.scale(-1, 1);
				
				if(this.idle){
					ctx.drawImage(
						this.images[0], //image
						this.imgIndex * 32, //x of the sprite sheet
						0, // y of the sprite sheet
						32, // width of the crop
						32, // height of the crop
						-this.x - 32, // x coord of where to draw
						this.y, // y coord of where to draw
						width, // width to draw the image
						height); // height to draw the image
				}
				else if(this.runningLeft){
				
					ctx.drawImage(
						this.images[1], //image
						this.imgIndex * 32, //x of the sprite sheet
						0, // y of the sprite sheet
						32, // width of the crop
						32, // height of the crop
						-this.x - 32, // x coord of where to draw
						this.y, // y coord of where to draw
						width, // width to draw the image
						height); // height to draw the image
				}
				else if(this.jumping){
					ctx.drawImage(
						this.images[2], //image
						this.imgIndex * 32, //x of the sprite sheet
						0, // y of the sprite sheet
						32, // width of the crop
						32, // height of the crop
						-this.x - 32, // x coord of where to draw
						this.y, // y coord of where to draw
						width, // width to draw the image
						height); // height to draw the image
				}
				else if(this.falling){
					ctx.drawImage(
						this.images[3], //image
						this.imgIndex * 32, //x of the sprite sheet
						0, // y of the sprite sheet
						32, // width of the crop
						32, // height of the crop
						-this.x - 32, // x coord of where to draw
						this.y, // y coord of where to draw
						width, // width to draw the image
						height); // height to draw the image
				}
			}
			else{
				
				if(this.idle){
					ctx.drawImage(
						this.images[0], //image
						this.imgIndex * 32, //x of the sprite sheet
						0, // y of the sprite sheet
						32, // width of the crop
						32, // height of the crop
						this.x, // x coord of where to draw
						this.y, // y coord of where to draw
						width, // width to draw the image
						height); // height to draw the image
				}
				else if(this.runningRight){
				
					ctx.drawImage(
						this.images[1], //image
						this.imgIndex * 32, //x of the sprite sheet
						0, // y of the sprite sheet
						32, // width of the crop
						32, // height of the crop
						this.x, // x coord of where to draw
						this.y, // y coord of where to draw
						width, // width to draw the image
						height); // height to draw the image
				}
				else if(this.jumping){
				
					ctx.drawImage(
						this.images[2], //image
						this.imgIndex * 32, //x of the sprite sheet
						0, // y of the sprite sheet
						32, // width of the crop
						32, // height of the crop
						this.x, // x coord of where to draw
						this.y, // y coord of where to draw
						width, // width to draw the image
						height); // height to draw the image
				}
				else if(this.falling){
				
					ctx.drawImage(
						this.images[3], //image
						this.imgIndex * 32, //x of the sprite sheet
						0, // y of the sprite sheet
						32, // width of the crop
						32, // height of the crop
						this.x, // x coord of where to draw
						this.y, // y coord of where to draw
						width, // width to draw the image
						height); // height to draw the image
				}
			}
			
			ctx.restore();
		}
	}
};

Player.prototype.animate = function(){

		// increment tics
		this.tics += 1;
		
		// if tics is >= the tics allowed per frame
		// this controls the speed of the animation
		if(this.tics >= this.ticsPerFrame)
		{
			// reset tics
			this.tics = 0;
			
			if(this.idle){
			
				// if we have reached the end of the sprite sheet
				// if not, increment the imgIndex
				if(this.imgIndex >= 3)
				{
					// reset the imgIndex
					this.imgIndex = 0;
				}
				else this.imgIndex += 1;
			}
			else if(this.runningLeft || this.runningRight){
			
				// if we have reached the end of the sprite sheet
				// if not, increment the imgIndex
				if(this.imgIndex >= 5)
				{
					// reset the imgIndex
					this.imgIndex = 1;
				}
				else this.imgIndex += 1;
			}
			else if(this.jumping || this.falling){
			
				this.imgIndex = 0;
			}
		}
	}

//BEGIN CHAD
//assigns the current platform type the player is on
Player.prototype.isOnPlatform = function isOnPlatform(platform){
	
	this.platform = platform;
};
//END CHAD