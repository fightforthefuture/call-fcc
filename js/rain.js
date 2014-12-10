window.addEvent('domready', function() {
	var pre	=	new Image();
	pre.src	=	'images/heart.png';
	
	start_rain.delay(200);
});

start_rain = function()
{
	var _rain	=	new rain('rain', 'images/heart.png', .4, 100);
}

var rain	=	new Class({
	container:	null,
	coords:		null,
	
	drops:		[],
	
	options: {
		image_url:	null,
		delay:		null,
		amount:		.2,
		speed:		7000
	},
	
	initialize: function(container, image_url, amount, delay)
	{
		this.container	=	$(container);
		if(!this.container) return false;
		
		this.coords	=	this.container.getCoordinates();
		
		var delay	=	parseInt(delay) >=0 ? delay : 0;
		var amount	=	parseFloat(amount) < 0 || parseFloat(amount) > 1 ? .2 : amount;
		
		this.options.image_url	=	image_url;
		this.options.delay		=	delay;
		this.options.amount		=	amount;
		
		this.rain();
	},
	
	rain: function()
	{
		if(Math.random() < this.options.amount)
		{
			this.add_drop();
		}
		
		this.drops.each(function(img, idx) {
			var y = parseInt(img.getStyle('bottom'));
			if(y >= this.coords.height)
			{
				//console.log('removing (remaining: '+this.drops.length+')')
				this.remove_drop(idx);
			}
		}.bind(this));
		
		this.rain.delay(this.options.delay, this);
	},
	
	add_drop: function()
	{
		var img	=	new Image();
		img.src	=	this.options.image_url;
		
		var width	=	img.width;
		var height	=	img.height;
		img.prop	=	width / height;
		
		img.height	=	parseInt(((Math.random() * .8) + .2) * height);
		img.width	=	img.height * img.prop;
		
		img.size	=	parseInt(100 * ((img.width / width)));
		img.inv		=	parseInt(100 * (1 - (img.width / width)));
		
		var bottom	=	-(img.height + 10);
		
		var left	=	Math.floor(Math.random() * (this.coords.width - img.width));
		if(left + img.width > this.coords.right)
		{
			left	=	this.coords.right - img.width;
		}
		
		img.setStyles({
			bottom:	bottom + 'px',
			left:	left + 'px',
			zIndex:	img.size
		});		
		
		img.inject(this.container, 'bottom');
		
		var duration	=	this.options.speed;
		duration		+=	(img.inv / 100) * 4 * duration;
		
		img.fx	=	new Fx.Tween(img, {property: 'bottom', duration: duration, transition: Fx.Transitions.linear}); //Fx.Transitions.Sine.easeIn
		img.fx.start(this.coords.height);
		
		
		this.drops.push(img);
	},
	
	remove_drop: function(index)
	{
		this.drops[index].destroy();
		this.drops.splice(index, 1);
	}
});
