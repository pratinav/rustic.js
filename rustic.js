/*!
 * rustic.js 1.0.4  (http://pratinav.tk/rustic.js/)
 * (c) 2015 Pratinav Bagla (http://pratinav.tk)
 * Released under the MIT license (https://github.com/Pratinav/rustic.js/blob/master/LICENSE.txt)
 **/

 (function($) {
 	/**
 	* Included easeInOutQuad animation
 	*/
 	$.extend( $.easing,{
 		easeInOutQuad: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
 	});

	/**
	* Get DOM element from selector
	*/
	function getElementString(arr, content) {
		if (content===undefined) {
			content = '';
		}
		var tag = '',
			classes = '',
			id = '',
			current = 'tag';
		for (var x = 0; x < arr.length; x++) {
			var ch = arr[x];
			if (ch==='.') {
				classes += x>1 ? ' ' : '';
				current = 'class';
				continue;
			} else if (ch === '#') {
				current = 'id';
				continue;
			}
			if (current === 'tag') {
				tag += ch;
			} else if (current === 'class') {
				classes += ch;
			} else if (current==='id') {
				id += ch;
			}
		}
		el = '<'+tag;
		if (id !== '') el += ' id=\"'+id+'\"';
		if (classes !== '') el += ' class=\"' + classes + '\"';
		el += '>'+content+'</'+tag+'>';
		return el;
	}

 	$.fn.rustic = function(options) {
 		/**
 		* Declare all settings
 		*/
		var config = $.extend({
			looping: false,
			defaultCallback: [
				function() {},
				function() {} 
			],
			specificCallbacks: {},
			breakingPoint: 0,
			easing: 'easeInOutQuad',
			transitionDuration: 500,
			pagination: true,
			paginationWrapper: ['div.rustic-pagination', ''],
			paginationPoint: ['span.rustic-pagination-point', ''],
			paginationCss: true, 
			specificPaginationPoints: {}
		}, options);

		return this.each(function() {


			/**
			* Declare and initalize vars
			*/
			var enabled = true,
				$wrapper = $(this),
				$pages = $wrapper.children(),
				pageCount = $pages.length,
				$paginationWrapper,
				$paginationPoints,
				initPag = false;


			/**
			* Initialize pagination
			*/
			function initPagination() {
				initPag = true;
				$wrapper.append(getElementString(config.paginationWrapper[0], config.paginationWrapper[1]));
				$paginationWrapper = $wrapper.children().last();
				var paginationString = getElementString(config.paginationPoint[0], config.paginationPoint[1]);
				for (var x = 0; x < pageCount; x++) {
					$paginationWrapper.append(config.specificPaginationPoints.hasOwnProperty(x+1) ? getElementString(config.specificPaginationPoints[x+1][0], config.specificPaginationPoints[x+1][1]):paginationString);
				}
				$paginationPoints = $paginationWrapper.children();
				if (config.paginationCss) {
					var paginationWrapperSelector = config.paginationWrapper[0],
						paginationSelector = config.paginationPoint[0];
					if (!$('style').length) $('head').append('<style type="text/css"></style>');
					var $style = $('style');
					$style.append(
						paginationWrapperSelector+'{'+
							'position: fixed;'+
							'top: 50%;'+
							'-webkit-transform: translateY(-50%);'+
							'-ms-transform: translateY(-50%);'+
							'transform: translateY(-50%);'+
							'right: 10px;'+
						'}'+
						paginationSelector+'{'+
						'box-sizing: border-box;'+
						'height: 16px;'+
						'width: 16px;'+
						'border-radius: 50%;'+
						'border: 3px solid white;'+
						'opacity: 0.4;'+
						'display: block;'+
						'margin: 10px 0;'+
						'cursor: pointer;'+
						'background: none;'+
						'transition: all 200ms ease-in-out;'+
						'}'+
						paginationSelector+'.active {'+
							'background: white;'+
							'opacity: 1'+
						'}'+
						paginationSelector+':hover {'+
							'opacity: 1'+
						'}'
					);
				}
			}


			/**
			* Hide pagination
			*/
		    function hidePagination() {
		    	if (!initPag) return;
				if (config.pagination) config.pagination = false;
				if ($paginationWrapper.css('display') !== 'none') $paginationWrapper.hide();
			}


			/**
			* Show pagination
			*/
			function showPagination() {
				if (!config.pagination) {
					config.pagination = true;
					if (!initPag) initPagination();
				}
				if ($paginationWrapper.css('display') === 'none') $paginationWrapper.show();
			}


			/**
			* Move to desired page
			* @param place: Desires page no. (index + 1)
			*/
			function moveTo(place) {
				var $currentPage = $pages.filter('.active'),
					currentIndex = $currentPage.index(),
					nextIndex = place-1;
				if (nextIndex === currentIndex) return;

				if (nextIndex < 0) nextIndex = pageCount-1;
				else if (nextIndex >= pageCount) nextIndex = 0;
				preventScroll = true;
				var nextPage = $pages.eq(nextIndex),
					callback = config.specificCallbacks.hasOwnProperty(nextIndex+1) ? config.specificCallbacks[nextIndex+1]:config.defaultCallback,
					limit = $(document).height()-$(window).height(),
					target = nextPage.offset().top;

				if (target >= limit) {
					nextIndex = pageCount-1;
					nextPage = $pages.eq(nextIndex);
					target = limit;
				}

				$currentPage.removeClass('active');
		        $paginationPoints.eq(currentIndex).removeClass('active');
				nextPage.addClass('active');
		        $paginationPoints.eq(nextIndex).addClass('active');
				callback[0]();
				$('html body').animate({
		            scrollTop: target
		        }, config.transitionDuration, config.easing, function() {
		        	callback[1]();
			        setTimeout(function() {preventScroll = false;}, 500);
		        });
			}


			/**
			* Move down one page
			*/
			function moveDown() {
				var currentPage = $pages.filter('.active').index();
				moveTo(currentPage+2);
			}


			/**
			* Move up one page
			*/
			function moveUp() {
				var currentPage = $pages.filter('.active').index();
				moveTo(currentPage);
			}


			/**
			* Update pagination with scrolling
			*/
			function updatePagination() {
				if(enabled || !config.pagination) return;
				var $currentPoint = $paginationPoints.filter('.active'),
					pageIndex = $pages.filter('.active').index(),
					newIndex = enabled ? pageIndex : 0,
					st = $(window).scrollTop();
				if (st >= $(document).height()-$(window).height()) {
					newIndex = pageCount-1;
				} else {
					for(var x = 0; x < pageCount; x++) {
						var current = $pages.eq(x).offset().top - (0.5*$(window).height());
						if (st >= current) newIndex = x;
						else break;
					}
				}
				if (newIndex === pageIndex) return;
				$pages.filter('.active').removeClass('active');
				$currentPoint.removeClass('active');
				$pages.eq(newIndex).addClass('active');
				$paginationPoints.eq(newIndex).addClass('active');
			}


			/**
			* Init function
			*/
			function init() {
				if (config.pagination) initPagination();
				$pages.eq(0).addClass('active');
				$paginationPoints.eq(0).addClass('active');
			}
			init();


			/**
			* Stop the one page effect
			*/
			function unrustic() {
				if (enabled) {
					enabled = false;
					$(window).bind('scroll', updatePagination);
				}
			}


			/**
			* Revive the effect/reset the settings
			*/
			function rerustic(reset) {
				if (!enabled) {
					enabled = true;
					$(window).unbind('scroll', updatePagination);
				}
				for (var newOption in reset) {
					if (reset.hasOwnProperty(newOption))
						config[newOption] = reset[newOption];
				}
			}

			/**
			* Check for breaking point
			*/
			function resize(e) {
				var vw = $(window).width();
				if(vw <= config.breakingPoint) unrustic();
				else rerustic();
			}


			/**
			* Event handler for pagination click
			*/
			$paginationPoints.click(function(e) {
				moveTo($(this).index()+1);
			});


			/**
			* Event handling for- resize, mouse-scroll and touch
			*/
			var preventScroll = false,
				touchStartY,
				touchStartX;
			$(window).on({
				'resize': resize,
				'DOMMouseScroll mousewheel wheel': function(e) {
					if (!enabled) return;
					if (!preventScroll) {
						if (e.originalEvent.wheelDelta < 0 || e.originalEvent.detail > 0) moveDown();
						else moveUp();
					}
					if(e.preventDefault) { e.preventDefault(); }
					e.stopPropagation();
				    e.returnValue = false;
				    return false;
				},
				'touchstart': function(e) {
					if (!enabled) return;
					touchStartY = e.originalEvent.touches[0].clientY;
					touchStartX = e.originalEvent.touches[0].clientX;
				},
				'touchend': function(e) {
					var touchEndY = e.originalEvent.changedTouches[0].clientY,
						touchEndX = e.originalEvent.changedTouches[0].clientX,
						yDiff = touchStartY - touchEndY,
						xDiff = touchStartX - touchEndX;
					if ( Math.abs( yDiff ) > Math.abs( xDiff ) ) {
				        if ( yDiff > 5 ) {
				            moveDown();
				        } else {
				            moveUp();
				        }                       
				    }
					touchStartY = null;
					touchStartX = null;
				},
				'touchmove': function(e) {
					if (enabled) {
						if(e.preventDefault) { e.preventDefault(); }
						return false;
					}
				}
			});


			/**
			* Event handling for key-presses
			*/
			$(document).keydown(function(e) {
				if (!enabled) return;
				var tag = e.target.tagName.toLowerCase();
				switch(e.which) {
					case 33:
					case 38:
						if (tag != 'input' && tag != 'textarea') {
							e.preventDefault();
							moveUp();
						}
						break;
					case 32:
					case 34:
					case 40:
						if (tag != 'input' && tag != 'textarea') {
							e.preventDefault();
							moveDown();
						}
						break;
					case 35: moveTo(pageCount); break;
					case 36: moveTo(1); break;
					default: return;
				}
			});


			/**
			* Event handler for unload
			*/
			$(window).unload(function() {
				$(this).scrollTop(0);
			});


			/**
			* Declare all external functions
			*/
			$.fn.rustic.moveUp = moveUp;
			$.fn.rustic.moveDown = moveDown;
			$.fn.rustic.moveTo = moveTo;
			$.fn.rustic.hidePagination = hidePagination;
			$.fn.rustic.showPagination = showPagination;
			$.fn.rustic.togglePagination = function() {
				if (!config.pagination) config.pagination = true;
				else config.pagination = false;
				if ($paginationWrapper.css('display') === 'none') $paginationWrapper.show();
				else $paginationWrapper.hide();
			};
			$.fn.unrustic = unrustic;
			$.fn.rerustic = rerustic;
			$.fn.rustic.toggle = function() {
				if (!enabled) {
					enabled = true;
					$(window).unbind('scroll', updatePagination);
				} else {
					enabled = false;
					$(window).bind('scroll', updatePagination);
				}
			};
		});

	};
 })(jQuery);