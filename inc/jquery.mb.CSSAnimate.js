/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: jquery.mb.CSSAnimate.js                                                                                                                    _
 _ last modified: 16/05/15 16.54                                                                                                                    _
 _                                                                                                                                                  _
 _ Open Lab s.r.l., Florence - Italy                                                                                                                _
 _                                                                                                                                                  _
 _ email: matbicoc@gmail.com                                                                                                                       _
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


jQuery.support.CSStransition = (function () {
	var thisBody = document.body || document.documentElement;
	var thisStyle = thisBody.style;
	return thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
})();

function uncamel(str) {
	return str.replace(/([A-Z])/g, function(letter) { return '-' + letter.toLowerCase(); });
}

function setUnit(i, units) {
	if ((typeof i === "string") && (!i.match(/^[\-0-9\.]+jQuery/))) {
		return i;
	} else {
		return "" + i + units;
	}
}

function setFilter (css, filter, val){

	var f = uncamel(filter);
	var fSfx = jQuery.mbBrowser.mozilla ? "" : jQuery.CSS.sfx;
	css[fSfx+"filter"] = css[fSfx+"filter"] || "";
	val = setUnit(val > jQuery.CSS.filters[filter].max ? jQuery.CSS.filters[filter].max : val, jQuery.CSS.filters[filter].unit);
	css[fSfx+"filter"] += f + "(" + val + ") ";

	delete css[filter];

}

jQuery.CSS = {

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

		if (jQuery.mbBrowser.webkit || jQuery.mbBrowser.opera) {
			jQuery.CSS.sfx = "-webkit-";
		} else if (jQuery.mbBrowser.mozilla) {
			jQuery.CSS.sfx = "-moz-";
		} else if (jQuery.mbBrowser.msie) {
			jQuery.CSS.sfx = "-ms-";
		}

		jQuery.CSS.sfx = "";

		for(var o in newOpt){

			if (o==="transform"){
				newOpt[jQuery.CSS.sfx+"transform"]=newOpt[o];
				delete newOpt[o];
			}

			if (o==="transform-origin"){
				newOpt[jQuery.CSS.sfx+"transform-origin"]=opt[o];
				delete newOpt[o];
			}

			/**
			 * CSS Filters
			 * */

			if (o==="filter" && !jQuery.mbBrowser.mozilla){
				newOpt[jQuery.CSS.sfx+"filter"]= opt[o];
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
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" translateX("+setUnit(opt[o],"px")+")");
				delete newOpt[o];
			}

			if (o === "y") {
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" translateY("+setUnit(opt[o],"px")+")");
				delete newOpt[o];
			}

			if (o === "z") {
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" translateZ("+setUnit(opt[o],"px")+")");
				delete newOpt[o];
			}

			/**
			 * Rotate
			 * */
			if (o === "rotate") {
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" rotate("+setUnit(opt[o],"deg")+")");
				delete newOpt[o];
			}

			if (o === "rotateX") {
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" rotateX("+setUnit(opt[o],"deg")+")");
				delete newOpt[o];
			}

			if (o === "rotateY") {
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" rotateY("+setUnit(opt[o],"deg")+")");
				delete newOpt[o];
			}

			if (o === "rotateZ") {
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" rotateZ("+setUnit(opt[o],"deg")+")");
				delete newOpt[o];
			}

			/**
			 * Scale
			 * */
			if (o === "scale") {
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" scale("+setUnit(opt[o],"")+")");
				delete newOpt[o];
			}

			if (o === "scaleX") {
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" scaleX("+setUnit(opt[o],"")+")");
				delete newOpt[o];
			}

			if (o === "scaleY") {
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" scaleY("+setUnit(opt[o],"")+")");
				delete newOpt[o];
			}

			if (o === "scaleZ") {
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" scaleZ("+setUnit(opt[o],"")+")");
				delete newOpt[o];
			}

			/**
			 * Skew
			 * */

			if (o === "skew") {
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" skew("+setUnit(opt[o],"deg")+")");
				delete newOpt[o];
			}

			if (o === "skewX") {
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" skewX("+setUnit(opt[o],"deg")+")");
				delete newOpt[o];
			}

			if (o === "skewY") {
				key = jQuery.CSS.sfx + "transform";
				newOpt[key] = newOpt[key] || "";
				newOpt[key]+= (" skewY("+setUnit(opt[o],"deg")+")");
				delete newOpt[o];
			}

			/**
			 * Perspective
			 * */
			if (o === "perspective") {
				key = jQuery.CSS.sfx + "transform";
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

			if(el.CSSAIsRunning && el.eventType == event.type && !jQuery.mbBrowser.msie && jQuery.mbBrowser.version<=9){
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

			cssObj = jQuery.normalizeCss(cssObj);

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

			$el.off(jQuery.CSS.transitionEnd+"."+el.id);

			var properties = jQuery.CSS.getProp(cssObj);

			function endTransition () {

				el.called = true;
				el.CSSAIsRunning = false;

				$el.off(jQuery.CSS.transitionEnd+"."+el.id);
				clearTimeout(el.timeout);
				$el.css(jQuery.CSS.sfx + "transition", "");
				if (typeof callback == "function") {
					callback.apply(el);
				}

				if(typeof el.CSSqueue == "function"){
					el.CSSqueue();
					el.CSSqueue = null;
				}
			};

			var css ={};
			jQuery.extend(css,cssObj);

			css[jQuery.CSS.sfx + "transition-property"] = properties;
			css[jQuery.CSS.sfx + "transition-duration"] = duration + "ms";
			css[jQuery.CSS.sfx + "transition-delay"] = delay + "ms";
			css[jQuery.CSS.sfx + "transition-timing-function"] = ease;


			setTimeout(function(){
				$el.one(jQuery.CSS.transitionEnd+"."+el.id, endTransition);
				$el.css(css);
			},1);

			//if there's no transition than call the callback anyway
			el.timeout = setTimeout(function () {

				if (el.called || !callback) {
					el.called = false;
					el.CSSAIsRunning = false;
					return;
				}

				$el.css(jQuery.CSS.sfx + "transition", "");
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

jQuery.fn.CSSAnimate = jQuery.CSS.animate;
jQuery.normalizeCss = jQuery.CSS.normalizeCss;


jQuery.fn.css3 = function(prop){
	return this.each(function(){
		var $el = jQuery(this);
		var css = jQuery.normalizeCss(prop);
		$el.css(css);
	})
};


