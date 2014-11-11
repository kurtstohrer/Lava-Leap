"use strict"

//player class
//needs x,y coords, a color (will be replaced by image), and the controller number
var Player = function Player(x, y, color, controls){

	//variables
	this.x = x;
	this.y = y;
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
}

//update
Player.prototype.update = function update(dt){
	
	//grab this players controller
	var pad = navigator.getGamepads()[this.controller];
	
	var jump;
	var left;
	var right;
	var run;
	//if it is not undefined
	if(pad != undefined)
	{aw
		//assign button values to save typing time
		jump = pad.buttons[0].pressed; //A button
		run = pad.buttons[2].pressed; // X button
		left = ((pad.axes[0] < -0.2) || (pad.buttons[14].pressed));//left stick left or dpad left
		right = ((pad.axes[0] > 0.2) || (pad.buttons[15].pressed));//left stick right or dpad right
		//var leftStickX = pad.axes[0];
		//var dPadLeft = pad.buttons[14];
		//var dPadRight = pad.buttons[15];
	}
	else if (this.controller == 0)
	{
		jump = app.keydown[104];//NUMPAD 8
		run = app.keydown[13];//NUMPAD ENTER
		left = app.keydown[100];//NUMPAD 4
		right = app.keydown[102];//NUMPAD 6
	}
	else if (this.controller == 1)
	{
		jump = app.keydown[87];//W
		run = app.keydown[32];//SPACE
		left = app.keydown[65];//A
		right = app.keydown[68];//D
	}
	//if the A button is pressed
	if(jump){
		
		this.yVelocity = -600;
		
	}
	
	//if the left D-pad is pressed of the left stick moved left, go left and limit the speed
	if(left){
		if(run)
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
		if(run)
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
	if(this.y > 1080 * 3/5 - this.height)
	{
		this.y = 1080 * 3/5 - this.height;
	}
	
};

//draw
Player.prototype.draw = function draw(ctx){

	//draw a square place-holder for the player location
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, this.width, this.height);
};