//Licensed under the MIT license
$(document).ready(function(){
	
	//Testing data
	//var data = {playAudio: true, showShootCountdown: false, targets: "5", color: "btn-primary", setupTime: "5", timeBefore: "10"};
	
	//Cookie data
	var cookieAsString = Cookies.get('TableSoccerSettings');
	var data = Cookies.getJSON('TableSoccerSettings');
	
	//Load setting if exists
	if(typeof data != 'undefined'){
		$('#SettingsAudio').prop('checked', data.playAudio);
		$('#ShowShootCountdown').prop('checked', data.showShootCountdown);
		var options = [
			'targets',
			'color',
			'setupTime',
			'timeBefore'
		];
		
		var colors = {
			'btn-primary': 'Blue',
			'btn-danger': 'Red',
			'btn-warning': 'Orange',
			'btn-info': 'Light blue,',
			'btn-success': 'Green'
		};
		
		$('.caption').each(function(key, object){
			var $object = $(object);
			var value = $(object).html();
			if($object.attr('type') == 'text'){
				$($object).html('<span class="'+data.color.replace('btn-', 'text-')+'">'+colors[data.color]+'</span>');
			}else{
				$(object).html(data[options[key]]);
			}
		});
	}
	
	//Make the bootstrap dropdown menu to a selectbox :-)
	$('.fake-option').click(function(){
		var $this = $(this);
		var value = $this.html();
		//Set new caption
		$this.parents('div.input-group-btn.open').find('.caption').html(value);
	});
	
	//Save settings to cookie
	$('#save').click(function(){
		var options = [
			'targets',
			'color',
			'setupTime',
			'timeBefore'
		];
		
		var data = {};
		data['playAudio'] = $('#SettingsAudio').prop('checked');
		data['showShootCountdown'] = $('#ShowShootCountdown').prop('checked');
		
		$('.caption').each(function(key, object){
			var $object = $(object);
			var value = $(object).html();
			if($object.attr('type') == 'text'){
				data[options[key]] = 'primary';
				
				if(value !== 'Select'){
					data[options[key]] = $(value).attr('class').replace('text-', 'btn-');
				}
				
			}else{
				//The user did not select someting, so we set 5 as default
				data[options[key]] = 5;
				
				if(value !== 'Select'){
					data[options[key]] = value;
				}
			}
		});
		
		Cookies.set('TableSoccerSettings', data, { expires: 365 });
		window.location.href = "index.html";
	});
	
	//Reset
	$('#reset').click(function(){
		Cookies.remove('TableSoccerSettings');
		window.location.href = "index.html";
	});
});
