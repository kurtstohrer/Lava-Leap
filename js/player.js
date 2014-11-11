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
	this.gravity = 4;
	this.ground = 300;
}

//update
Player.prototype.update = function update(dt){
	
	//grab this players controller
	var pad = navigator.getGamepads()[this.controller];
	
	//if it is not undefined
	if(pad != undefined){
		
		//assign button values to save typing time
		var buttonA = pad.buttons[0];
		var buttonX = pad.buttons[2];
		var leftStickX = pad.axes[0];
		var dPadLeft = pad.buttons[14];
		var dPadRight = pad.buttons[15];
		
		//if the A button is pressed
		if(buttonA.pressed){
		
			console.log("jumped");
			
		}
		
		//if the X button is pressed, speed up
		if(buttonX.pressed){
		
			this.maxVelocity = 15;
		}
		else this.maxVelocity = 6;
		
		//if the left D-pad is pressed of the left stick moved left, go left and limit the speed
		if(dPadLeft.pressed || leftStickX < -.2){
			
			this.xVelocity += this.acceleration * dt;
			
			if (this.xVelocity > this.maxVelocity){
			
				this.xVelocity = this.maxVelocity;
			}
			this.x -= this.xVelocity;
		}
		
		//if the righ D-pad is pressed of the left stick moved right, go right and limit the speed
		if(dPadRight.pressed || leftStickX > .2){
			
			this.xVelocity += this.acceleration * dt;
			
			if (this.xVelocity > this.maxVelocity){
			
				this.xVelocity = this.maxVelocity;
			}
			
			this.x += this.xVelocity;
		}
		
	}
};

//draw
Player.prototype.draw = function draw(ctx){

	//draw a square place-holder for the player location
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, 10, 10);
};