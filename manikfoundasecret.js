(function( $ ){
	var	manik = $('#manik');
	var	cave = $('#cave');
	var	torches = $('.torch');
	var	gloom = $('#gloom');
	var	text = $('#text');
	var treasure = $('#treasure');

	var iframe = treasure.find('iframe');
	var treasureLink = treasure.find('a');

	var secretSound, torchSound, itemSound, chestSound;
	var secretSoundReady = true;
	var torchSoundReady = true;
	var itemSoundReady = true;
	var chestSoundReady = true;
	
	var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g);
	
	var THUMBNAIL = window.location.search.split('=')[1] ? window.location.search.split('=')[1] : 'http://www.manikrathee.com/resources.php';
	if (THUMBNAIL) {
		treasureLink.attr('href', THUMBNAIL);
		treasureLink.attr('title', THUMBNAIL);
	}

	function soundSetup() {
		secretSound = new Audio();
		torchSound = new Audio();
		itemSound = new Audio();
		chestSound = new Audio();
		
		secretSoundReady = false;
		torchSoundReady = false;
		itemSoundReady = false;
		chestSoundReady = false;

		secretSound.addEventListener('canplaythrough', (function(){secretSoundReady = true;}), false);
		torchSound.addEventListener('canplaythrough', (function(){torchSoundReady = true;}), false);
		itemSound.addEventListener('canplaythrough', (function(){itemSoundReady = true;}), false);
		chestSound.addEventListener('canplaythrough', (function(){chestSoundReady = true;}), false);
		
		secretSound.src = 'http://manikfoundasecret.number61.net/sounds/secret.wav';
		torchSound.src = 'http://manikfoundasecret.number61.net/sounds/torch.wav';
		itemSound.src = 'http://manikfoundasecret.number61.net/sounds/item.wav';
		chestSound.src = 'http://manikfoundasecret.number61.net/sounds/chest.wav';
	}
		

	function play(sound) {
		if (sound) {
			sound.play();
		}
	}

	function step1() {
		
		if (!secretSoundReady || !torchSoundReady || !itemSoundReady || !chestSoundReady) {
			setTimeout(step1, 30);
			return;
		}
		
		
		step2();
	}

	function step2() {
		manik.addClass('step-1 walking');
		
		setTimeout(function() {
			manik.removeClass('walking');
			
			play(torchSound);
			
			lightsOn();
			
			setTimeout(function() {
				play(secretSound);
			}, 1000);

			treasure.on('click', step3);
			
		}, 1200);
	}

	// add a handler to the chest
	function step3() {

		manik.addClass('walking step-2').removeClass('step-1');

		setTimeout(function() {
			play(chestSound);
			treasure.addClass('open');
			manik.removeClass('walking');
			text.addClass('visible');

			treasure.off('click', step3);
			
			setTimeout(function() {
				play(itemSound);
			}, 100);
		}, 380);
	}
	


	function lightsOn() {
		torches.addClass('on-fire');
		gloom.addClass('full-light');
	}

	cave.on('click', '.torch', function() {
		$(this).toggleClass('on-fire');
		play(torchSound);
		if ($('.on-fire').length === 0 ) {
			gloom.removeClass('full-light half-light');
		} else if ($('.on-fire').length === 1 ) {
			gloom.removeClass('full-light').addClass('half-light');
		} else {
			gloom.removeClass('half-light').addClass('full-light');
		}
	});


	if (iOS) {
		// GO button that downloads all the assets
		$('<a id="go" href="#"></a>').appendTo($('body')).on('touchend', function(e) {
			e.preventDefault();
			$(this).remove();
			//soundSetup();
			step1();
		});
	} else {
		soundSetup();
		step1();
	}
	
})( jQuery );