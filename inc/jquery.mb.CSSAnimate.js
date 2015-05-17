/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: jquery.mb.CSSAnimate.js                                                                                                                    _
 _ last modified: 16/05/15 16.54                                                                                                                    _
 _                                                                                                                                                  _
 _ Open Lab s.r.l., Florence - Italy                                                                                                                _
 _                                                                                                                                                  _
 _ email: matteo@open-lab.com                                                                                                                       _
 _ site: http://pupunzi.com                                                                                                                         _
 _       http://open-lab.com                                                                                                                        _
 _ blog: http://pupunzi.open-lab.com                                                                                                                _
 _ Q&A:  http://jquery.pupunzi.com                                                                                                                  _
 _                                                                                                                                                  _
 _ Licences: MIT, GPL                                                                                                                               _
 _    http://www.opensource.org/licenses/mit-license.php                                                                                            _
 _    http://www.gnu.org/licenses/gpl.html                                                                                                          _
 _                                                                                                                                                  _
 _ Copyright (c) 2001-2015. Matteo Bicocchi (Pupunzi);                                                                                              _
 ___________________________________________________________________________________________________________________________________________________*/

/*
 * version: 2.0
 *  params:

 @opt        -> the CSS object (ex: {top:300, left:400, ...})
 @duration   -> an int for the animation duration in milliseconds
 @delay      -> an int for the animation delay in milliseconds
 @ease       -> ease  ||  linear || ease-in || ease-out || ease-in-out  ||  cubic-bezier(<number>, <number>,  <number>,  <number>)
 @callback   -> a callback function called once the transition end

 example:

 jQuery(this).CSSAnimate({top:t, left:l, width:w, height:h, transform: 'rotate(50deg) scale(.8)'}, 2000, 100, "ease-out", callback;})
 */

(function($){

	/*Browser detection patch*/
	eval(function(p,a,c,k,e,d){e=function(c){return c};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('29 11=17.53;24(!2.9){2.9={};2.9.34=!1;2.9.22=!1;2.9.45=!1;2.9.42=!1;2.9.40=!1;2.9.28=!1;2.9.56=11;2.9.16=17.51;2.9.13=""+47(17.23);2.9.18=26(17.23,10);29 32,12,20;24(-1!=(12=11.15("33")))2.9.45=!0,2.9.16="33",2.9.13=11.14(12+6),-1!=(12=11.15("25"))&&(2.9.13=11.14(12+8));27 24(-1!=(12=11.15("58")))2.9.28=!0,2.9.16="36 38 39",2.9.13=11.14(12+5);27 24(-1!=11.15("57")){2.9.28=!0;2.9.16="36 38 39";29 30=11.15("59:")+3,43=30+4;2.9.13=11.14(30,43)}27-1!=(12=11.15("41"))?(2.9.22=!0,2.9.40=!0,2.9.16="41",2.9.13=11.14(12+7)):-1!=(12=11.15("31"))?(2.9.22=!0,2.9.42=!0,2.9.16="31",2.9.13=11.14(12+7),-1!=(12=11.15("25"))&&(2.9.13=11.14(12+8))):-1!=(12=11.15("68"))?(2.9.22=!0,2.9.16="31",2.9.13=11.14(12+7),-1!=(12=11.15("25"))&&(2.9.13=11.14(12+8))):-1!=(12=11.15("35"))?(2.9.34=!0,2.9.16="35",2.9.13=11.14(12+8)):(32=11.37(" ")+1)<(12=11.37("/"))&&(2.9.16=11.14(32,12),2.9.13=11.14(12+1),2.9.16.63()==2.9.16.64()&&(2.9.16=17.51));-1!=(20=2.9.13.15(";"))&&(2.9.13=2.9.13.14(0,20));-1!=(20=2.9.13.15(" "))&&(2.9.13=2.9.13.14(0,20));2.9.18=26(""+2.9.13,10);67(2.9.18)&&(2.9.13=""+47(17.23),2.9.18=26(17.23,10));2.9.69=2.9.18}2.9.46=/65/19.21(11);2.9.49=/66/19.21(11);2.9.48=/60|61|55/19.21(11);2.9.50=/33 52/19.21(11);2.9.44=/54/19.21(11);2.9.62=2.9.46||2.9.49||2.9.48||2.9.44||2.9.50;',10,70,'||jQuery|||||||browser||nAgt|verOffset|fullVersion|substring|indexOf|name|navigator|majorVersion|i|ix|test|webkit|appVersion|if|Version|parseInt|else|msie|var|start|Safari|nameOffset|Opera|mozilla|Firefox|Microsoft|lastIndexOf|Internet|Explorer|chrome|Chrome|safari|end|windowsMobile|opera|android|parseFloat|ios|blackberry|operaMobile|appName|Mini|userAgent|IEMobile|iPod|ua|Trident|MSIE|rv|iPhone|iPad|mobile|toLowerCase|toUpperCase|Android|BlackBerry|isNaN|AppleWebkit|version'.split('|'),0,{}))

	jQuery.support.CSStransition = (function () {
		var thisBody = document.body || document.documentElement;
		var thisStyle = thisBody.style;
		return thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
	})();

	function uncamel(str) {
		return str.replace(/([A-Z])/g, function(letter) { return '-' + letter.toLowerCase(); });
	}

	function setUnit(i, units) {
		if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+$/))) {
			return i;
		} else {
			return "" + i + units;
		}
	}

	function setFilter (css, filter, val){

		var f = uncamel(filter);
		var fSfx = jQuery.browser.mozilla ? "" : $.CSS.sfx;
		css[fSfx+"filter"] = css[fSfx+"filter"] || "";
		val = setUnit(val > $.CSS.filters[filter].max ? $.CSS.filters[filter].max : val, $.CSS.filters[filter].unit);
		css[fSfx+"filter"] += f + "(" + val + ") ";

		delete css[filter];

	}

	$.CSS = {

		name:"mb.CSSAnimate",
		author:"Matteo Bicocchi",
		version:"2.0.0",

		transitionEnd: "transitionEnd",
		sfx : "",

		filters: {
			blur: {min: 0, max: 100, unit: "px"},
			brightness: {min: 0, max: 400, unit: "%"},
			contrast: {min: 0, max: 400, unit: "%"},
			grayscale: {min: 0, max: 100, unit: "%"},
			hueRotate: {min: 0, max: 360, unit: "deg"},
			invert: {min: 0, max: 100, unit: "%"},
			saturate: {min: 0, max: 400, unit: "%"},
			sepia: {min: 0, max: 100, unit: "%"}
		},

		normalizeCss:function(opt){
			var newOpt = jQuery.extend(true, {}, opt);

			if (jQuery.browser.webkit || jQuery.browser.opera) {
				$.CSS.sfx = "-webkit-";
			} else if (jQuery.browser.mozilla) {
				$.CSS.sfx = "-moz-";
			} else if (jQuery.browser.msie) {
				$.CSS.sfx = "-ms-";
			}

			for(var o in newOpt){

				if (o==="transform"){
					newOpt[$.CSS.sfx+"transform"]=newOpt[o];
					delete newOpt[o];
				}

				if (o==="transform-origin"){
					newOpt[$.CSS.sfx+"transform-origin"]=opt[o];
					delete newOpt[o];
				}

				/**
				 * CSS Filters
				 * */

				if (o==="filter" && !jQuery.browser.mozilla){
					newOpt[$.CSS.sfx+"filter"]= opt[o];
					delete newOpt[o];
				}

				if (o==="blur")
					setFilter(newOpt, "blur", opt[o] );

				if (o==="brightness")
					setFilter(newOpt, "brightness", opt[o] );

				if (o==="contrast")
					setFilter(newOpt, "contrast", opt[o] );

				if (o==="grayscale")
					setFilter(newOpt, "grayscale", opt[o] );

				if (o==="hueRotate")
					setFilter(newOpt, "hueRotate", opt[o] );

				if (o==="invert")
					setFilter(newOpt, "invert", opt[o] );

				if (o==="saturate")
					setFilter(newOpt, "saturate", opt[o] );

				if (o==="sepia")
					setFilter(newOpt, "sepia", opt[o] );

				/**
				 * Translate
				 * */

				var key="";

				if (o === "x") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" translateX("+setUnit(opt[o],"px")+")");
					delete newOpt[o];
				}

				if (o === "y") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" translateY("+setUnit(opt[o],"px")+")");
					delete newOpt[o];
				}

				if (o === "z") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" translateZ("+setUnit(opt[o],"px")+")");
					delete newOpt[o];
				}

				/**
				 * Rotate
				 * */
				if (o === "rotate") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" rotate("+setUnit(opt[o],"deg")+")");
					delete newOpt[o];
				}

				if (o === "rotateX") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" rotateX("+setUnit(opt[o],"deg")+")");
					delete newOpt[o];
				}

				if (o === "rotateY") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" rotateY("+setUnit(opt[o],"deg")+")");
					delete newOpt[o];
				}

				if (o === "rotateZ") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" rotateZ("+setUnit(opt[o],"deg")+")");
					delete newOpt[o];
				}

				/**
				 * Scale
				 * */
				if (o === "scale") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" scale("+setUnit(opt[o],"")+")");
					delete newOpt[o];
				}

				if (o === "scaleX") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" scaleX("+setUnit(opt[o],"")+")");
					delete newOpt[o];
				}

				if (o === "scaleY") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" scaleY("+setUnit(opt[o],"")+")");
					delete newOpt[o];
				}

				if (o === "scaleZ") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" scaleZ("+setUnit(opt[o],"")+")");
					delete newOpt[o];
				}

				/**
				 * Skew
				 * */

				if (o === "skew") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" skew("+setUnit(opt[o],"deg")+")");
					delete newOpt[o];
				}

				if (o === "skewX") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" skewX("+setUnit(opt[o],"deg")+")");
					delete newOpt[o];
				}

				if (o === "skewY") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" skewY("+setUnit(opt[o],"deg")+")");
					delete newOpt[o];
				}

				/**
				 * Perspective
				 * */
				if (o === "perspective") {
					key = $.CSS.sfx + "transform";
					newOpt[key] = newOpt[key] || "";
					newOpt[key]+= (" perspective("+setUnit(opt[o],"px")+")");
					delete newOpt[o];
				}

			}

			return newOpt;
		},

		getProp: function(css){

			var prop = [];
			for(var key in css){
				if(prop.indexOf(key)<0)
					prop.push(uncamel(key));
			}
			return prop.join(",");

		},

		animate: function(cssObj, duration, delay, ease, callback){

			return this.each(function () {

				var el = this;
				var $el = jQuery(this);
				el.id = el.id || "CSSA_" + new Date().getTime();

				var event = event || {type:"noEvent"};

				if(el.CSSAIsRunning && el.eventType == event.type && !jQuery.browser.msie && jQuery.browser.version<=9){
					el.CSSqueue = function(){
						$el.CSSAnimate(cssObj, duration, delay, ease, callback);
					};
					return;
				}

				el.CSSqueue=null;
				el.eventType = event.type;

				if ($el.length === 0 || !cssObj) {
					return;
				}

				cssObj = $.normalizeCss(cssObj);

				el.CSSAIsRunning = true;

				if (typeof duration == "function") {
					callback = duration;
					duration = jQuery.fx.speeds["_default"];
				}

				if (typeof delay == "function") {
					ease = delay;
					delay = 0;
				}

				if (typeof delay == "string") {
					callback = delay;
					delay = 0;
				}

				if (typeof ease == "function") {
					callback = ease;
					ease = "cubic-bezier(0.65,0.03,0.36,0.72)";
				}

				if (typeof duration == "string") {
					for (var d in jQuery.fx.speeds) {
						if (duration == d) {
							duration = jQuery.fx.speeds[d];
							break;
						} else {
							duration = jQuery.fx.speeds["_default"];
						}
					}
				}

				if(!duration)
					duration = jQuery.fx.speeds["_default"];


				if (typeof callback === "string"){
					ease = callback;
					callback = null

				}

				if (!jQuery.support.CSStransition) {

					for (var o in cssObj) {

						if (o === "transform") {
							delete cssObj[o];
						}
						if (o === "filter") {
							delete cssObj[o];
						}
						if (o === "transform-origin") {
							delete cssObj[o];
						}

						if (cssObj[o] === "auto") {
							delete cssObj[o];
						}

						if (o === "x") {
							var val = cssObj[o];
							var key = "left";
							cssObj[key] = val;
							delete cssObj[o];
						}

						if (o === "y") {
							var val = cssObj[o];
							var key = "top";
							cssObj[key] = val;
							delete cssObj[o];
						}

						if (o === "-ms-transform" || o === "-ms-filter") {
							delete cssObj[o];
						}

					}

					$el.delay(delay).animate(cssObj, duration, callback);
					return;
				}

				var cssEase = {
					'default':       'ease',
					'in':             'ease-in',
					'out':            'ease-out',
					'in-out':         'ease-in-out',
					'snap':           'cubic-bezier(0,1,.5,1)',
					'easeOutCubic':   'cubic-bezier(.215,.61,.355,1)',
					'easeInOutCubic': 'cubic-bezier(.645,.045,.355,1)',
					'easeInCirc':     'cubic-bezier(.6,.04,.98,.335)',
					'easeOutCirc':    'cubic-bezier(.075,.82,.165,1)',
					'easeInOutCirc':  'cubic-bezier(.785,.135,.15,.86)',
					'easeInExpo':     'cubic-bezier(.95,.05,.795,.035)',
					'easeOutExpo':    'cubic-bezier(.19,1,.22,1)',
					'easeInOutExpo':  'cubic-bezier(1,0,0,1)',
					'easeInQuad':     'cubic-bezier(.55,.085,.68,.53)',
					'easeOutQuad':    'cubic-bezier(.25,.46,.45,.94)',
					'easeInOutQuad':  'cubic-bezier(.455,.03,.515,.955)',
					'easeInQuart':    'cubic-bezier(.895,.03,.685,.22)',
					'easeOutQuart':   'cubic-bezier(.165,.84,.44,1)',
					'easeInOutQuart': 'cubic-bezier(.77,0,.175,1)',
					'easeInQuint':    'cubic-bezier(.755,.05,.855,.06)',
					'easeOutQuint':   'cubic-bezier(.23,1,.32,1)',
					'easeInOutQuint': 'cubic-bezier(.86,0,.07,1)',
					'easeInSine':     'cubic-bezier(.47,0,.745,.715)',
					'easeOutSine':    'cubic-bezier(.39,.575,.565,1)',
					'easeInOutSine':  'cubic-bezier(.445,.05,.55,.95)',
					'easeInBack':     'cubic-bezier(.6,-.28,.735,.045)',
					'easeOutBack':    'cubic-bezier(.175, .885,.32,1.275)',
					'easeInOutBack':  'cubic-bezier(.68,-.55,.265,1.55)'
				};

				if (cssEase[ease])
					ease = cssEase[ease];

				$el.off($.CSS.transitionEnd+"."+el.id);

				var properties = $.CSS.getProp(cssObj);

				function endTransition () {

					el.called = true;
					el.CSSAIsRunning = false;

					$el.off($.CSS.transitionEnd+"."+el.id);
					clearTimeout(el.timeout);
					$el.css($.CSS.sfx + "transition", "");
					if (typeof callback == "function") {
						callback.apply(el);
					}

					if(typeof el.CSSqueue == "function"){
						el.CSSqueue();
						el.CSSqueue = null;
					}
				};

				var css ={};
				$.extend(css,cssObj);

				css[$.CSS.sfx + "transition-property"] = properties;
				css[$.CSS.sfx + "transition-duration"] = duration + "ms";
				css[$.CSS.sfx + "transition-delay"] = delay + "ms";
				css[$.CSS.sfx + "transition-timing-function"] = ease;


				setTimeout(function(){
					$el.one($.CSS.transitionEnd+"."+el.id, endTransition);
					$el.css(css);
				},1);

				//if there's no transition than call the callback anyway
				el.timeout = setTimeout(function () {

					if (el.called || !callback) {
						el.called = false;
						el.CSSAIsRunning = false;
						return;
					}

					$el.css($.CSS.sfx + "transition", "");
					callback.apply(el);

					el.CSSAIsRunning = false;
					if(typeof el.CSSqueue == "function"){
						el.CSSqueue();
						el.CSSqueue = null;
					}
				}, duration + delay + 10);

			})
		}

	};

	$.fn.CSSAnimate = $.CSS.animate;
	$.normalizeCss = $.CSS.normalizeCss;


	$.fn.css3 = function(prop){
		return this.each(function(){
			var $el = $(this);
			var css = $.normalizeCss(prop);
			$el.css(css);
		})
	};


})(jQuery);
