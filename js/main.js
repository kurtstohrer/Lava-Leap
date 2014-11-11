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
	colors: ["green", "red", "blue", "black"],
	platforms1: [],
	platforms2: [],
	startPlatform: undefined,
	gamestate: "GAME",
	ticks: 0,
    
    // methods
	init : function() {
		// declare properties
		this.canvas = document.querySelector('canvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
		
		this.ctx.textAlign = 'center';
		
		//get connected gamepads
		var pad = navigator.getGamepads();
		
		//loop through and create a player for each gamepad
		for(var i = 0; i < 2; i++)
		{
			this.players.push(new Player((this.WIDTH/4)*(i+1)-240, 500, this.colors[i], i));
		}
		for(var i = 2; i < pad.length; i++){
			
			if(pad[i] != undefined){
			
				this.players.push(new Player((this.WIDTH/4)*(i+1)-240, 500, this.colors[i], i));
			}
		}
		
		var pwidth = Math.random() * 300 + 100;
		var px = Math.random() * (this.WIDTH - pwidth);
		this.platforms1.push(new app.Platform(pwidth, px));
		pwidth = Math.random() * 300 + 100;
		px = Math.random() * (this.WIDTH - pwidth);
		this.platforms2.push(new app.Platform(pwidth, px));
		this.startPlatform = new app.Platform(this.WIDTH, 0);
		this.startPlatform.y = this.HEIGHT * 3/5;
			
		this.update();
	},
		
	draw: function()
	{
		if(this.gamestate == "GAME"){
		
			this.ctx.save();
			this.ctx.fillStyle = "white";
			this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
			this.ctx.restore();
			if(this.startPlatform.active)
			{
				this.startPlatform.draw(this.ctx);
			}
			for(var i = 0; i < this.platforms1.length; i++)
			{
				this.platforms1[i].draw(this.ctx);
			}
			for(var i = 0; i < this.platforms2.length; i++)
			{
				this.platforms2[i].draw(this.ctx);
			}
			
			//loop through and draw the players
			for(var i = 0; i < this.players.length; i++){
				
				this.players[i].draw(this.ctx);
			}
		}
	},
	
	update: function()
	{
		requestAnimationFrame(this.update.bind(this));
		
		if(this.gamestate == "GAME")
		{
			//loop through and update the players
			this.ticks++;
			for(var i = 0; i < this.players.length; i++){
				
				this.players[i].update(this.dt);
				while(this.players[i].y < 200)
				{
					for(var j = 0; j < this.players.length; j++)
					{
						this.players[j].y += 1;
					}
					for(var j = 0; j < this.platforms1.length; j++)
					{
						this.platforms1[j].y += 1;
					}
					for(var j = 0; j < this.platforms2.length; j++)
					{
						this.platforms2[j].y += 1;
					}
				}
			}
		
			if(this.platforms1[0].y + this.PLATFORM_DIFFERENCE * 2/3 > this.startPlatform.y && this.startPlatform.active)
			{
				this.startPlatform.update(this.dt);
			}
			
			var highest1 = this.HEIGHT;
			var highest1index = 0;
			var highest2 = this.HEIGHT;
			var highest2index = 0;
			for(var i = 0; i < this.platforms1.length; i++)
			{
				if(highest1 > this.platforms1[i].y)
				{
					highest1 = this.platforms1[i].y;
					highest1index = i;
				}
				this.platforms1[i].update(this.dt);
			}
			for(var i = 0; i < this.platforms2.length; i++)
			{
				if(highest2 > this.platforms2[i].y)
				{
					highest2 = this.platforms2[i].y;
					highest2index = i;
				}
				this.platforms2[i].update(this.dt);
			}
			if(highest1 > this.PLATFORM_DIFFERENCE)//this.PLATFORM_DIFFERENCE = 200
			{
				var pwidth = Math.random() * 300 + 100;
				var px = Math.random() * 1200 + this.platforms1[highest1index].x - 600;
				if(px + pwidth > this.WIDTH)
				{
					var diff =  px + pwidth - this.WIDTH;
					px -= 2 * diff;
				}
				if(px < 0)
				{
					px = -px;
				}
				this.platforms1.push(new app.Platform(pwidth, px));
			}
			if(highest2 > this.PLATFORM_DIFFERENCE)//this.PLATFORM_DIFFERENCE = 200
			{
				var pwidth = Math.random() * 300 + 100;
				var px = Math.random() * 1200 + this.platforms2[highest2index].x - 600;
				if(px + pwidth > this.WIDTH)
				{
					var diff =  px + pwidth - this.WIDTH;
					px -= 2 * diff;
				}
				if(px < 0)
				{
					px = -px;
				}
				this.platforms2.push(new app.Platform(pwidth, px));
			}
			this.platforms1 = this.platforms1.filter(function(platform)
			{
				return platform.active;
			});
			this.platforms2 = this.platforms2.filter(function(platform)
			{
				return platform.active;
			});
			//console.log(this.platforms1.length + " " + this.platforms2.length);
		}//END gamestate = "GAME"
		
		
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
