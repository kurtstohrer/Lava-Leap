"use strict"

//player class
//needs x,y coords, a color (will be replaced by image), and the controller number
var Player = function Player(x, y, color, controls){

	//variables
	this.x = x;
	this.y = y;
	this.prevx = this.x;
	this.prevy = this.y;
	this.color = color;
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
	this.platformType = "normal";
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
		else if (this.controller == 1)
		{
			jump = app.keydown[104];//NUMPAD 8
			run = app.keydown[13];//NUMPAD ENTER
			left = app.keydown[100];//NUMPAD 4
			right = app.keydown[102];//NUMPAD 6
			start = app.keydown[80]; // P
		}
		
		//EDIT - CHAD
		//added control based on what platform the player is currently on
			
		if(this.platformType == "tramp"){
		
			this.yVelocity = -500;
		}
		//if the A button is pressed
		else if(jump && this.canHoldJump)
		{
			//EDIT - CHAD
			//reset platform type when players jump to resume normal movement
			this.platformType = "normal";
			
			if(this.canJump)
			{
				this.yVelocity = -900;
			}
			else
			{
				this.yVelocity -= this.gravity - 30;
			}
		}
		else
		{
			this.canHoldJump = false;
		}
		
		//if the left D-pad is pressed of the left stick moved left, go left and limit the speed
		if(left)
		{
			if(this.platformType == "slow"){
				
				this.x -= 160 * dt;
			}
			else this.x -= 480 * dt;
		}
		
		//if the righ D-pad is pressed of the left stick moved right, go right and limit the speed
		if(right)
		{
			if(this.platformType == "slow")
			{
				this.x += 160 * dt;
			}
			else this.x += 480 * dt;
		}
		
		if(this.x < 0)
		{
			this.x = 0;
		}
		if(this.x > 1920 - this.height)
		{
			this.x = 1920 - this.height
		}
		
		this.yVelocity += this.gravity;
		this.y += this.yVelocity * dt;
		if(this.y > 1080) this.active = false;
	}
};

//draw
Player.prototype.draw = function draw(ctx)
{
	if(this.active)
	{
		//draw a square place-holder for the player location
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}
};

//BEGIN CHAD
//assigns the current platform type the player is on
Player.prototype.isOnPlatformType = function isOnPlatform(type){
	
	this.platformType = type;
};
//END CHAD