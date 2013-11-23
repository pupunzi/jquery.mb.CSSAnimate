/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.CSSAnimate.js
 *
 *  Copyright (c) 2001-2013. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 21/11/13 23.14
 *  *****************************************************************************
 */

/*
 * version: 1.6.2
 *  params:

 @opt        -> the CSS object (ex: {top:300, left:400, ...})
 @duration   -> an int for the animation duration in milliseconds
 @delay      -> an int for the animation delay in milliseconds
 @ease       -> ease  ||  linear || ease-in || ease-out || ease-in-out  ||  cubic-bezier(<number>, <number>,  <number>,  <number>)
 @callback   -> a callback function called once the transition end

 example:

 jQuery(this).CSSAnimate({top:t, left:l, width:w, height:h, transform: 'rotate(50deg) scale(.8)'}, 2000, 100, "ease-out", callback;})
 */


/*Browser detection patch*/
if (!jQuery.browser) {
	jQuery.browser = {};
	jQuery.browser.mozilla = !1;
	jQuery.browser.webkit = !1;
	jQuery.browser.opera = !1;
	jQuery.browser.msie = !1;
	var nAgt = navigator.userAgent;
	jQuery.browser.ua = nAgt;
	jQuery.browser.name = navigator.appName;
	jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion);
	jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10);
	var nameOffset, verOffset, ix;
	if (-1 != (verOffset = nAgt.indexOf("Opera")))jQuery.browser.opera = !0, jQuery.browser.name = "Opera", jQuery.browser.fullVersion = nAgt.substring(verOffset + 6), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)); else if (-1 != (verOffset = nAgt.indexOf("MSIE")))jQuery.browser.msie = !0, jQuery.browser.name = "Microsoft Internet Explorer", jQuery.browser.fullVersion = nAgt.substring(verOffset + 5); else if (-1 != nAgt.indexOf("Trident")) {
		jQuery.browser.msie = !0;
		jQuery.browser.name = "Microsoft Internet Explorer";
		var start = nAgt.indexOf("rv:") + 3, end = start + 4;
		jQuery.browser.fullVersion = nAgt.substring(start, end)
	} else-1 != (verOffset = nAgt.indexOf("Chrome")) ? (jQuery.browser.webkit = !0, jQuery.browser.name = "Chrome", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7)) : -1 != (verOffset = nAgt.indexOf("Safari")) ? (jQuery.browser.webkit = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("AppleWebkit")) ? (jQuery.browser.webkit = !0, jQuery.browser.name = "Safari", jQuery.browser.fullVersion = nAgt.substring(verOffset + 7), -1 != (verOffset = nAgt.indexOf("Version")) && (jQuery.browser.fullVersion = nAgt.substring(verOffset + 8))) : -1 != (verOffset = nAgt.indexOf("Firefox")) ? (jQuery.browser.mozilla = !0, jQuery.browser.name = "Firefox", jQuery.browser.fullVersion = nAgt.substring(verOffset + 8)) : (nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/")) && (jQuery.browser.name = nAgt.substring(nameOffset, verOffset), jQuery.browser.fullVersion = nAgt.substring(verOffset + 1), jQuery.browser.name.toLowerCase() == jQuery.browser.name.toUpperCase() && (jQuery.browser.name = navigator.appName));
	-1 != (ix = jQuery.browser.fullVersion.indexOf(";")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix));
	-1 != (ix = jQuery.browser.fullVersion.indexOf(" ")) && (jQuery.browser.fullVersion = jQuery.browser.fullVersion.substring(0, ix));
	jQuery.browser.majorVersion = parseInt("" + jQuery.browser.fullVersion, 10);
	isNaN(jQuery.browser.majorVersion) && (jQuery.browser.fullVersion = "" + parseFloat(navigator.appVersion), jQuery.browser.majorVersion = parseInt(navigator.appVersion, 10));
	jQuery.browser.version = jQuery.browser.majorVersion;
}




jQuery.fn.CSSAnimate = function (opt, duration, delay, ease, callback) {
	return this.each(function () {

		var el = jQuery(this);

		this.id = this.id || "CSSA_" + new Date().getTime();

		if (el.length === 0 || !opt) {
			return;
		}

		if (typeof duration == "function") {
			callback = duration;
			duration = jQuery.fx.speeds["_default"];
		}
		if (typeof delay == "function") {
			callback = delay;
			delay = 0
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
					duration = null;
				}
			}
		}

		//http://cssglue.com/cubic
		//  ease  |  linear | ease-in | ease-out | ease-in-out  |  cubic-bezier(<number>, <number>,  <number>,  <number>)

		if (!jQuery.support.transition) {

			for (var o in opt) {
				if (o === "transform") {
					delete opt[o];
				}
				if (o === "filter") {
					delete opt[o];
				}
				if (o === "transform-origin") {
					delete opt[o];
				}
				if (opt[o] === "auto") {
					delete opt[o];
				}
			}

			if (!callback || typeof callback === "string")
				callback = "linear";

			el.animate(opt, duration, callback);
			return;
		}

		var sfx = "";
		var transitionEnd = "transitionEnd";
		if (jQuery.browser.webkit) {
			sfx = "-webkit-";
			transitionEnd = "webkitTransitionEnd";
		} else if (jQuery.browser.mozilla) {
			sfx = "-moz-";
			transitionEnd = "transitionend";
		} else if (jQuery.browser.opera) {
			sfx = "-o-";
			transitionEnd = "otransitionend";
		} else if (jQuery.browser.msie) {
			sfx = "-ms-";
			transitionEnd = "msTransitionEnd";
		}

		var prop = [];
		for (var o in opt) {
			var key = o;
			if (key === "transform") {
				key = sfx + "transform";
				opt[key] = opt[o];
				delete opt[o];
			}
			if (key === "filter") {
				key = sfx + "filter";
				opt[key] = opt[o];
				delete opt[o];
			}
			if (key === "transform-origin") {
				key = sfx + "transform-origin";
				opt[key] = opt[o];
				delete opt[o];
			}
			prop.push(key);

		}
		var properties = prop.join(",");

		var endTransition = function (e) {
			el.off(transitionEnd+"."+el.get(0).id);
			clearTimeout(el.get(0).timeout);
			el.css(sfx + "transition", "");
			if (typeof callback == "function") {
				el.called = true;
				callback(el);
			}
		};

		var css ={};
		$.extend(css,opt);
		css[sfx + "transition-property"] = properties;
		css[sfx + "transition-duration"] = duration + "ms";
		css[sfx + "transition-delay"] = delay + "ms";
		css[sfx + "transition-timing-function"] = ease;
		css[sfx + "backface-visibility"] = "hidden";

		setTimeout(function(){
			el.css(css);
			el.one(transitionEnd+"."+el.get(0).id, endTransition);
		},1);

		//if there's no transition than call the callback anyway
		el.get(0).timeout = setTimeout(function () {
			if (el.called || !callback) {
				el.called = false;
				return;
			}

			el.css(sfx + "transition", "");
			callback(el);

		}, duration+ delay + 100);

	})
};
// jQuery.support.transition
// to verify that CSS3 transition is supported (or any of its browser-specific implementations)
jQuery.support.transition = (function () {
	var thisBody = document.body || document.documentElement;
	var thisStyle = thisBody.style;
	return thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
})();
