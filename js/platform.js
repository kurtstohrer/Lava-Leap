//gem.js

"use strict"

var app = app || {};

app.Platform = function()
{
	//EDIT - CHAD
	//added a type for each platform
	function Platform(width, x, image, type)
	{
		this.height = 5;
		this.width = width;
		this.x = x; //point (x,y) is top left of platform, make sure platform generation is consistent with that
		this.y = -this.height;
		this.active = true;
		this.img = image;
		this.type = type;
		this.currentType = type;
		this.prevType = type;
		this.xVelocity = Math.random() * 100 + 100;
		if(Math.random() < 0.5)
		{
			this.xVelocity *= -1;
		}
		this.ghost = false;
		if(this.type == "ghost")
		{
			this.ghost = true;
		}
		this.sticky = false;
		if(this.type == "sticky")
		{
			this.sticky = true;
		}
		
		//for animation
		this.imgIndex = 0;
		
		if(this.type == "ghost"){
		
			this.ticsPerFrame = 10;
		}
		else this.ticsPerFrame = 45;
		
		this.tics = 0;
		this.animating = false;
		this.counter = 0;
	}
	
	var p = Platform.prototype;
	
	p.constructor = function()
	{
		
	}
	
	p.update = function(dt, speed)
	{
		this.prevType = this.type;
		
		if(this.type == "moving")
		{
			if(this.x < 0)
			{
				this.x = 0;
				this.xVelocity *= -1;
			}
			if(this.x > 1920 - this.width)
			{
				this.x = 1920 - this.width;
				this.xVelocity *= -1;
			}
			this.x += this.xVelocity * dt;
		}
		if(this.ghost && Math.random() < 0.5 * dt)//randomly toggles roughly every 2 seconds
		{
			if(this.type == "ghost")
			{
				this.type = "normal";
			}
			else if(this.type == "normal")
			{
				this.type = "ghost";
			}
		}
		if(this.type == "sticky")
		{
			if (this.y > 600)
			{
				this.sticky = false;
				this.imgIndex = 2;
			}
			if (this.y > 500 && this.y <= 600)
			{
				this.imgIndex = 1;
			}
		}
		if(this.type == "tramp")
		{
			this.imgIndex = Math.min(Math.floor(this.y / 180), 5);
		}
		this.y += speed * dt;
		this.active = this.active && this.y < 1080;
		
		if(this.currentType == "normal" && this.prevType == "ghost"){
		
			this.animate();
		}
		
		this.currentType = this.type;
	};
	
	p.draw = function(ctx)
	{
		
	
		//ctx.save();
		//ctx.fillStyle = "black";
		//ctx.fillRect(this.x, this.y, this.width, this.height);
		//ctx.restore();
		//if(this.type == "moving"){
		//	for(var i = 0; i < app.main.WIDTH; i+=32){
		//	
		//		ctx.drawImage(app.main.platformImages[3], 0 + i, this.y);
		//	}
		//}
		
		for(var i = 0; i < this.width; i+=32)
		{
			if(this.type != "ghost" && this.type != "tramp" && this.type != "sticky")
			{
				ctx.save();
				ctx.drawImage(this.img, this.x + i, this.y);
				ctx.restore();
				
				if(this.prevType == "ghost" && this.currentTyp == "normal"){
					
					for(var i = 0; i < this.width; i+=32){
				
						ctx.drawImage(
						app.main.platformImages[3], //image
						this.imgIndex * 32, //x of the sprite sheet
						0, // y of the sprite sheet
						32, // width of the crop
						16, // height of the crop
						this.x+i, // x coord of where to draw
						this.y, // y coord of where to draw
						32, // width to draw the image
						16); // height to draw the image
					}
				}
			}
		}
		if(this.type == "tramp")
		{	
			//line for debugger
			/*
			ctx.save();
			ctx.fillStyle = "purple";
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.restore();
			*/
			
			for(var i = 0; i < this.width; i+=32){
				
				ctx.drawImage(
					this.img, //image
					this.imgIndex * 32, //x of the sprite sheet
					0, // y of the sprite sheet
					32, // width of the crop
					16, // height of the crop
					this.x+i, // x coord of where to draw
					this.y, // y coord of where to draw
					32, // width to draw the image
					16); // height to draw the image
			}
		}
		else if(this.type == "sticky")
		{	
			for(var i = 0; i < this.width; i+=32){
				//console.log(this.width);
				ctx.drawImage(
					this.img, //image
					this.imgIndex * 32, //x of the sprite sheet
					0, // y of the sprite sheet
					32, // width of the crop
					20, // height of the crop
					this.x+i, // x coord of where to draw
					this.y, // y coord of where to draw
					32, // width to draw the image
					20); // height to draw the image
			}
			
			if(false && this.sticky)
			{
				ctx.save();
				ctx.fillStyle = "green";
				ctx.fillRect(this.x, this.y, this.width, this.height);
				ctx.restore();
			}
			
		}
		else if(this.ghost)
		{
			ctx.save();
			ctx.fillStyle = "rgba(255,255,255,0.25)";
			ctx.fillRect(this.x, this.y, this.width, this.height/2);
			ctx.restore();
		}
	};
	
	p.draw2 = function(ctx, num)//temp function to differentiate platforms
	{
		ctx.save();
		//ctx.fillStyle = "black";
		if(num == 1)
		{
			ctx.fillStyle = "red";
			app.drawLib.text(ctx, "" + this.x + this.width, this.x, this.y - 20, 20, "black");
		}
		if(num == 2)
			ctx.fillStyle = "blue";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	};
	
	p.animate = function()
	{
		// increment tics
		this.tics += 1;
		
		// if tics is >= the tics allowed per frame
		// this controls the speed of the animation
		if(this.tics >= this.ticsPerFrame)
		{
			// reset tics
			this.tics = 0;
			
			// if we have reached the end of the sprite sheet
			// if not, increment the imgIndex
			if(this.type == "tramp" && this.imgIndex == 5 && false)
			{
				// reset the counter, imgIndex and turn animating off
				this.imgIndex = 5;
				this.counter = 0;
				this.animating = false;
			}
			else if(this.type == "sticky" && this.imgIndex == 2 && false)
			{
				// reset the counter, imgIndex and turn animating off
				this.imgIndex = 2;
				this.counter = 0;
				this.animating = false;
			}
			else if(this.currentType == "normal" && this.prevType == "ghost" && this.imgIndex == 5)
			{
				// reset the counter, imgIndex and turn animating off
				this.imgIndex = 5;
				this.counter = 0;
				this.animating = false;
			}
			else this.imgIndex += 1;
		}
	}
	
	return Platform;
}();