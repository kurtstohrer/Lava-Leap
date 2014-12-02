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
	}
	
	var p = Platform.prototype;
	
	p.constructor = function()
	{
		
	}
	
	p.update = function(dt, speed)
	{
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
			console.log(this.type);
			if(this.type == "ghost")
			{
				this.type = "normal";
			}
			else if(this.type == "normal")
			{
				this.type = "ghost";
			}
			console.log(this.type);
			console.log();
		}
		if(this.type == "sticky" && this.y > 800)
		{
			this.type = "normal";
		}
		this.y += speed * dt;
		this.active = this.active && this.y < 1080;
	};
	
	p.draw = function(ctx)
	{
		
	
		//ctx.save();
		//ctx.fillStyle = "black";
		//ctx.fillRect(this.x, this.y, this.width, this.height);
		//ctx.restore();
		
		for(var i = 0; i < this.width; i+=32)
		{
			if(this.type != "ghost")
			{
				ctx.save();
				ctx.drawImage(this.img, this.x + i, this.y);
				ctx.restore();
			}
		}
		if(this.type == "tramp")
		{	
			ctx.save();
			ctx.fillStyle = "purple";
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.restore();
		}
		if(this.type == "sticky")
		{	
			ctx.save();
			ctx.fillStyle = "green";
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.restore();
		}
		if(this.ghost)
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
	
	return Platform;
}();