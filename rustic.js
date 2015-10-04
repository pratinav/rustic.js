/*!====================================================
 * rustic.js 1.0.1  (http://pratinav.tk/rustic.js/)
 *=====================================================
 * @author: Pratinav Bagla (http://pratinav.tk)
 * @license: The MIT License (https://github.com/Pratinav/rustic.js/blob/master/LICENSE.txt)
 *=====================================================*/
 /*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Pratinav Bagla
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/

 (function($){
 	// easeInOut
 	$.extend( $.easing,{
 		easeInOutQuad: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
 	});
 	$.fn.rustic = function(options) {
 		// Declare all options.
		var config = $.extend({
			element: 'section', // Element used for pages
			looping: false, // For looping at the end of slides,
			defaultCallback: [
				function() {}, // Before
				function() {} // After
			], // Default callback function before and after slide-change
			specificCallbacks: {}, // Specific callback functions before and after slide-change
			breakingPoint: 0, // For breaking effect at specific width
			easing: 'easeInOutQuad', // JS easing. if scrollbar: true
			transitionDuration: 500, // Duration of slide transition
			pagination: true, // For visibility of default pagination,
			paginationWrapper: '<div class="rustic-pagination"></div>', // Element for pagination wrapper
			paginationPoint: '<span class="rustic-pagination-point"></span>', // Element for pagination points
			paginationCss: true, // For default pagination styles
			specificPaginationPoints: {} // Element for specific pagination points
		}, options);

		return this.each(function() {

			// get selector name for custom pagination elements
			function getSelectorName(el) {
				var selector = el
			        .parents()
			        .map(function() { return this.tagName.toLowerCase(); })
			        .get()
			        .reverse()
			        .concat([this.nodeName])
			        .join(">");
			   	selector+=el.prop("tagName").toLowerCase();
			    var id = el.attr("id");
			    if (id) {
			      selector += "#"+ id;
			    }

			    var classNames = el.attr("class");
			    if (classNames) {
			      selector += "." + $.trim(classNames).replace(/\s/gi, ".");
			    }

			    return selector;
			}

			function getPos() {
				for (var x = 0; x < pageCount; x++) {
					if ($pages.eq(x).hasClass('current')) return x;
				}
			}

			var enabled = true,
				$wrapper = $(this),
				$pages = $wrapper.children(config.element),
				pageCount = $pages.length,
				extraChildren = $wrapper.children().length - pageCount,
				$paginationWrapper, $paginationPoints,
				initPag = false,
				initTop = 0;

			function initPagination() {
				initPag = true;
				$wrapper.append(config.paginationWrapper);
				$paginationWrapper = $wrapper.children().last();
				for (var x = 0; x < pageCount; x++) $paginationWrapper.append(config.specificPaginationPoints.hasOwnProperty(x+1) ? config.specificPaginationPoints[x+1]:config.paginationPoint);
				$paginationPoints = $paginationWrapper.children();
				if (config.paginationCss) {
					var paginationWrapperSelector = getSelectorName($paginationWrapper),
						paginationSelector = getSelectorName($paginationPoints.not('.active'));
					if (!$('style').length) $('head').append('<style type="text/css"></style>');
					var $style = $('style');
					$style.append(
						paginationWrapperSelector+'{'+
							'position: fixed;'+
							'top: 50%;'+
							'-webkit-transform: translateY(-50%);'+
							'-ms-transform: translateY(-50%);'+
							'transform: translateY(-50%);'+
							'left: 10px;'+
						'}'+
						paginationSelector+'{'+
						'box-sizing: border-box;'+
						'height: 16px;'+
						'width: 16px;'+
						'border-radius: 50%;'+
						'border: 3px solid rgba(255,255,255,0.4);'+
						'display: block;'+
						'margin: 10px 0;'+
						'cursor: pointer;'+
						'background: none;'+
						'transition: all 200ms ease-in-out;'+
						'}'+
						paginationSelector+'.active {'+
							'background: white;'+
						'}'+
						paginationSelector+':hover {'+
							'border-color: white;'+
						'}'
					);
				}
			}
			if (config.pagination) initPagination();

			function initializeScrollPos() {
				$(window).scroll(function() {
					var initIndex = 0,
						st = $(window).scrollTop(),
						limit = $(document).height()-$(window).height();
					for (var x = 0; x < pageCount; x++) {
						var top = $pages.eq(x).offset().top;
						if (st >= top) initIndex = x;
						else break;
					}
					if (st >= limit) initIndex = pageCount-1;
					$pages.eq(initIndex).addClass('current');
					initTop = $pages.eq(initIndex).offset.top;
					if(config.pagination) $paginationPoints.eq(initIndex).addClass('active');
			        $(window).unbind('scroll');
				});
				$(window).scroll();
				resize();
		    }

			$(document).ready(function() {
				setTimeout(initializeScrollPos, 100);
				$(window).load(function() {
					var st = $(window).scrollTop();
					if ((st !== 0 && (enabled ? true: st < $pages.eq(0).outerHeight())) && getPos() === 0) {
						initializeScrollPos();
					}
				});
			});

			function updatePagination() {
				if( !config.pagination && enabled) return;
				var $currentPoint = $paginationPoints.filter('.active'),
					newIndex = enabled ? getPos() : 0;
				if (!enabled) {
					var st = $(window).scrollTop();
					if (st >= $(document).height()-$(window).height()) {
						newIndex = pageCount-1;
					} else {
						for(var x = 0; x < pageCount; x++) {
							var current = $pages.eq(x).offset().top - (0.5*$(window).height());
							if (st >= current) newIndex = x;
							else break;
						}
					}
					if (newIndex !== getPos()) {
						$pages.filter('.current').removeClass('current');
						$pages.eq(newIndex).addClass('current');
					}
				}
				$currentPoint.removeClass('active');
				$paginationPoints.eq(newIndex).addClass('active');
			}

		    function hidePagination() {
		    	if (!initPag) return;
				if (config.pagination) {
					config.pagination = false;
					updatePagination();
				}
				if ($paginationWrapper.css('display') !== 'none') $paginationWrapper.hide();
			}

			function showPagination() {
				if (!config.pagination) {
					config.pagination = true;
					if (!initPag) initPagination();
					updatePagination();
				}
				if ($paginationWrapper.css('display') === 'none') $paginationWrapper.show();
			}

			function moveDown() {
				var currentPage = $pages.filter('.current'),
					currentIndex = getPos(),
					nextPage, nextIndex;
				if (!(!config.looping && currentIndex+1 === pageCount)) {
					preventScroll = true;
					nextIndex = currentIndex+1 === pageCount ? 0 : currentIndex+1;
					nextPage = $pages.eq(nextIndex);
					var callback = config.specificCallbacks.hasOwnProperty(nextIndex+1) ? config.specificCallbacks[nextIndex+1]:config.defaultCallback,
						limit = $(document).height()-$(window).height(),
						target = nextPage.offset().top;
					if (target >= limit) {
						nextIndex = pageCount-1;
						nextPage = $pages.eq(nextIndex);
						target = limit;
					}
					currentPage.removeClass('current');
					nextPage.addClass('current');
					callback[0]();
					$('html body').animate({
			            scrollTop: target
			        }, config.transitionDuration, config.easing, function() {
			        	callback[1]();
				        setTimeout(function() {preventScroll = false;}, 500);
			        });
			        updatePagination();
				}
			}

			function moveUp() {
				var currentPage = $pages.filter('.current'),
					currentIndex = getPos(),
					nextPage, nextIndex;
				if (!(!config.looping && currentIndex === 0)) {
					preventScroll = true;
					nextIndex = currentIndex === 0 ? pageCount-1 : currentIndex-1;
					nextPage = $pages.eq(nextIndex);
					var callback = config.specificCallbacks.hasOwnProperty(nextIndex+1) ? config.specificCallbacks[nextIndex+1]:config.defaultCallback,
						limit = $(document).height()-$(window).height(),
						target = nextPage.offset().top >= limit ? limit : nextPage.offset().top;
					if (currentPage.offset().top >= limit) {
						for (var x = currentIndex; x >= 0; x--) {
							if ($pages.eq(x).offset().top < limit) {
								nextIndex = x;
								nextPage = $pages.eq(nextIndex);
								target = nextPage.offset().top;
								break;
							}
						}
					}
					currentPage.removeClass('current');
					nextPage.addClass('current');
					callback[0]();
					$('html body').animate({
			            scrollTop: target
			        }, config.transitionDuration, config.easing, function() {
						callback[1]();
				        setTimeout(function() {preventScroll = false;}, 500);
			        });
			        updatePagination();
				}
			}

			function moveTo(place) {
				var currentPage = $pages.filter('.current'),
					currentIndex = getPos(),
					nextIndex = place-1,
					nextPage = $pages.eq(nextIndex);
				if (nextPage.length > 0) {
					preventScroll = true;
					var callback = config.specificCallbacks.hasOwnProperty(nextIndex+1) ? config.specificCallbacks[nextIndex+1]:config.defaultCallback,
						limit = $(document).height()-$(window).height(),
						target = nextPage.offset().top;
					if (target >= limit) {
						nextIndex = pageCount-1;
						nextPage = $pages.eq(nextIndex);
						target = limit;
					}
					currentPage.removeClass('current');
					nextPage.addClass('current');
					callback[0]();
					$('html body').animate({
			            scrollTop: target
			        }, config.transitionDuration, config.easing, function() {
			        	callback[1]();
				        setTimeout(function() {preventScroll = false;}, 500);
			        });
			        updatePagination();
				}
			}

			function unrustic() {
				if (enabled) {
					enabled = false;
					$(window).bind('scroll', updatePagination);
				}
			}
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

			function resize(e) {
				var vw = $(window).width();
				if(vw <= config.breakingPoint) unrustic();
				else rerustic();
			}
			$(window).resize(resize);

			if (config.pagination) {
				$paginationPoints.bind('click', function(e) {
					var currentPageIndex = getPos(),
						newIndex = $(this).index();
					if (newIndex === currentPageIndex) return;
					moveTo($(this).index()+1);
					updatePagination();
				});
			}

			var preventScroll = false,
				touchStartY = initTop;
			$wrapper.on({
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
				},
				'touchend': function(e) {
					if (!enabled) return;
					var touchEndY = e.originalEvent.changedTouches[0].clientY;
					if(touchStartY > touchEndY+5) moveDown();
					else if(touchStartY < touchEndY-5) moveUp();
				}
			});

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