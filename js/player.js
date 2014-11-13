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
	this.gravity = 20;
	this.ground = 300;
	this.width = 10;
	this.height = 10;
	this.canJump = false;
	this.canHoldJump = false;
	this.active = true;
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
		//if the A button is pressed
		if(jump && this.canHoldJump)
		{
			if(this.canJump)
			{
				this.yVelocity = -600;
			}
			else
			{
				this.yVelocity -= 5;
			}
		}
		else
		{
			this.canHoldJump = false;
		}
		
		//if the left D-pad is pressed of the left stick moved left, go left and limit the speed
		if(left){
			if(run = false)
			{
				this.x -= 900 * dt;
			}
			else
			{
				this.x -= 360 * dt;
			}
		}
		
		//if the righ D-pad is pressed of the left stick moved right, go right and limit the speed
		if(right){
			if(run = false)
			{
				this.x += 900 * dt;
			}
			else
			{
				this.x += 360 * dt;
			}
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