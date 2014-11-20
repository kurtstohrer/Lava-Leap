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
	}
	
	var p = Platform.prototype;
	
	p.constructor = function()
	{
		
	}
	
	p.update = function(dt, speed)
	{
		this.y += speed * dt;
		this.active = this.active && this.y < 1080;
	};
	
	p.draw = function(ctx)
	{
		
	
		//ctx.save();
		//ctx.fillStyle = "black";
		//ctx.fillRect(this.x, this.y, this.width, this.height);
		//ctx.restore();
		
		for(var i = 0; i < this.width; i+=32){
			
			ctx.save();
			ctx.drawImage(this.img, this.x + i, this.y);
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