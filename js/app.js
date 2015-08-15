//Licensed under the MIT license
$(document).ready(function(){
	//Testing data
	//var cookieData = {playAudio: true, showShootCountdown: false, targets: "5", color: "btn-primary", setupTime: "5", timeBefore: "10"};
	
	
	var cookieAsString = Cookies.get('TableSoccerSettings');
	var cookieData = Cookies.getJSON('TableSoccerSettings');

	var training = new TrainingClass(cookieData);
	

	if(typeof cookieData != 'undefined'){
		$('#runSetup').hide();
		$('#startTraining').show();
		$('#startTraining').click(function(){
			training.start();
		});
	}
	
	$('#stopTraining').click(function(){
		training.stop();
	});
	
	$('#hit').click(function(){
		training.hit++;
		$('#hitInfo').html(training.hit + '/' +training.shoot + ' (' +(Math.round(training.hit/training.shoot*100)) + '%)');
	});
});


function TrainingClass(cookieData){
	this.isRunning = false;
	this.cookie = cookieData;

	this.shoot = 0;
	this.hit = 0;
	this.percentage = 0;
	this.$targets = {};
	
	this.start = function(){
		$('#'+this.cookie.targets+'-targets').show();
		$('#startTraining').hide();
		
		this.shoot = 0;
		this.hit = 0;
		this.percentage = 0;
		this.$targets = {};
		
		for(var i = 1; i <= this.cookie.targets; i++){
			this.$targets[this.cookie.targets + '-target-' + i] = $('#'+this.cookie.targets+'-target-'+i);
		}
		$('#stopTraining').show();
		$('#hitInfo').html('0/0 (0%)');
		
		if(!this.cookie.showShootCountdown){
			$('#shootCountdown').hide();
		}
		
		this.isRunning = true;
		this.setupCountdown();
	};
	
	
	this.stop = function(){
		this.isRunning = false;
		$('#startTraining').show();
		$('#setupContainer').hide();
		$('#shootContainer').hide();
		$('#stopTraining').hide();
		this.hit = 0;
		this.shoot = 0;
		clearInterval(this.interval);
		for(var key in this.$targets){
			this.$targets[key].removeClass(this.color);
		}
	};
	
	this.setupCountdown = function(){
		$('#setupContainer').show();
		var $setupCountdown = $('#setupCountdown');
		var counter = parseInt(this.cookie.setupTime, 10);
		if(this.shoot > 0){
			$('#hitInfo').html(this.hit + '/' +this.shoot + ' (' +Math.round((this.hit/this.shoot*100)) + '%)');
		}
		$setupCountdown.html(counter);
		var self = this;
		self.interval = setInterval(function(){
			counter--;
			if(counter >= 0) {
				$setupCountdown.html(counter);
				for(var key in self.$targets){
					self.$targets[key].removeClass(self.cookie.color);
				}
				
			}
			if(counter === 0){
				$('#setupContainer').hide();
				clearInterval(self.interval);
				if(self.isRunning === true){
					self.shootCountdown();
				}
			}
		}, 1000);
	};
	
	this.shootCountdown = function(){
		$('#shootContainer').show();
		var $shootCountdown = $('#shootCountdown');
		var counter = this.rand(1, parseInt(this.cookie.timeBefore, 10));

		$shootCountdown.html(counter);
		var self = this;
		self.interval = setInterval(function(){
			counter--;
			if(counter >= 0) {
				$shootCountdown.html(counter);
			}
			if(counter === 0){
				//Set target
				var numberOfTargets = parseInt(self.cookie.targets, 10);
				var targetNo = self.rand(1, numberOfTargets);
				self.$targets[numberOfTargets+'-target-'+targetNo].addClass(self.cookie.color);
				if(self.cookie.playAudio === true){
					document.getElementById('beep').play();
				}
				
				$('#shootContainer').hide();
				clearInterval(self.interval);
				self.shoot++;
				if(self.isRunning === true){
					self.setupCountdown();
				}
			}
		}, 1000);
	};
	
	this.rand = function(min, max){
		max = max + 1;
		return parseInt((Math.random() * (max - min) + min), 10);
	};
}
