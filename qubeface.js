/*** QubeFace qubeface.js is a JavaScript library for 3D cubes - Version: 1.0.0 - Date: 20.02.2021 - Author: Ingmar Hedrich - Licence: MIT ***/
var isQubeFaceCssAdded = false;

// ### QubeFace object constructor ### 
function QubeFace(obj) {
	
	this.id = null;
	this.effect = "ease-in-out";
	this.backgroundColor = "rgba(255,255,255,.85)"; // main background color
	this.spinDurationSeconds = null; // spin animation duration in seconds (e.g. 0.7)
	this.actLock = false; // action lock flag to complete the animation transformation
	this.sizePx = (this.sizePx == null ? 400 : this.sizePx);
	this.startFace = "front"; // set start face by face name only before calling 'init()', otherwise use 'showFaceInstantly(faceName)'
	this.enableEventsWhileSpinning = false; // enable events while spinning (default is disabled, to prevent unwanted click/touch events)
	this.disableUnpresentFaces = false;
	this.stopSwipe = false; // stop or re-activate swipe (this works only if swipe was enabled before)
	this.stopSwipeX = false; // stop or re-activate vertical swipe (this works only if swipe was enabled before)
	this.stopSwipeY = false; // stop or re-activate horizontal swipe (this works only if swipe was enabled before)
	this.stopSwipeRight = false;
	this.stopSwipeLeft = false;
	this.stopSwipeUp = false;
	this.stopSwipeDown = false;
	this.borderWidth = 0; // border width in pixels as numeric value (0 means no border)
	this.borderColor = "rgba(0, 0, 0, 1.0)"; // border color (default: white)
	this.borderStyle = "solid"; // border style
	this.boxShadow = "inset 0 0 20px rgba(0,0,0,.2)"; // default boxShadow
	this.textAlign = "center"; // text-align 'center' as default for all faces
	this.perspectivePx = 800; // perspective depth
	this.perspectiveOrigin = null; // horizontal (in %) and vertical (in px) perspective as '50% 100px'
	
	// initial faces content
	this.front = "";
	this.right = "";
	this.back = "";
	this.left = "";
	this.top = "";
	this.bottom = "";

	// initial faces background colors
	this.frontBgColor = "";
	this.rightBgColor = "";
	this.backBgColor = ""; 
	this.leftBgColor = "";
	this.topBgColor = "";
	this.bottomBgColor = "";
	
	// assign object properties
	if ("function" != typeof Object.assign) {
		for (var fld in obj) {
			if (obj.hasOwnProperty(fld)) { this[fld] = obj[fld]; }
		}
	} else { Object.assign(this, obj); }
	
	// set global values on object instantiation
	var divId = this.id, spinAnimationSeconds = this.spinDurationSeconds;
	var currentFace = this.startFace;
	var futureIdx = 0;
	var hasBorder = false;
	var onSwipeUpAct = "", onSwipeDownAct = "", onSwipeLeftAct = "", onSwipeRightAct = "";
	var afterSwipeUpAct = "", afterSwipeDownAct = "", afterSwipeLeftAct = "", afterSwipeRightAct = "";
	var autoSpinMode = null;
	var ap1, ap2, ap3; // last auto-spin parameter

	// initialize qube
	this.init = function () {
		if (this.id == null || this.id === "") {
			console.error("No QubeFace ID was found. Define the element ID of a QubeFace object to solve the problem. ");
			return;
		}
		this.sizePx = (this.sizePx == null ? 400 : this.sizePx);
		var sPx = this.sizePx; // normal qube face size
		var hPx = sPx / 2; // half qube face size
		
		if (this.perspectiveOrigin == null) { this.perspectiveOrigin = '50% ' + hPx + 'px'; }
		this.spinDurationSeconds = (this.spinDurationSeconds == null ? 0.7 : this.spinDurationSeconds);
		spinAnimationSeconds = this.spinDurationSeconds // set global value
		this.actLock = false;
		hasBorder = (this.borderWidth != null && this.borderWidth !== 0);
		
		// set face on start
		var initTransformStyle = "";
		var rotateStyle = getRotationStyle(this.startFace, this.sizePx);
		initTransformStyle = "transform:" + rotateStyle + ";";
		currentFace = this.startFace;
		
		// render qube
		var divQube = document.getElementById(this.id);
		if (divQube == null) {
			console.error("The QubeFace div container with the ID '" + this.id + "' doesn't exist. ");
			return;
		}
		var qclasses = (divQube.className === "" ? "qube" : "qube " + divQube.className );
		var bgcMain = this.backgroundColor;
		var bgc = []; 
		var bgcClr = [];
		// set face background color(s)
		for (var i = 0; i < 6; i++) {
			switch(i) {
				case 0:
					bgc[i] = (this.frontBgColor == "" ? bgcMain : this.frontBgColor);
					break;
				case 1:
					bgc[i] = (this.backBgColor == "" ? bgcMain : this.backBgColor);
					break;
				case 2:
					bgc[i] = (this.topBgColor == "" ? bgcMain : this.topBgColor);
					break;
				case 3:
					bgc[i] = (this.bottomBgColor == "" ? bgcMain : this.bottomBgColor);
					break;
				case 4:
					bgc[i] = (this.leftBgColor == "" ? bgcMain : this.leftBgColor);
					break;
				case 5:
					bgc[i] = (this.rightBgColor == "" ? bgcMain : this.rightBgColor);
					break;
				default:
					bgc[i] = bgcMain;
					break;
			}
			bgcClr[i] = bgc[i];
			bgc[i] = " background-color: " + bgc[i] + ";";
		}
		
		var boxShadow = (this.boxShadow == null || this.boxShadow === "" ? "" : "box-shadow:" + this.boxShadow + ";");
		var shadeVal = (this.boxShadow === "" ? null : this.boxShadow);
		var border = (!hasBorder ? "" : "border:" + this.borderWidth + "px " + this.borderStyle + " " + this.borderColor + ";");
		var borderVal = (!hasBorder ? null : this.borderWidth + "px " + this.borderStyle + " " + this.borderColor);
		var txAlVal = (this.textAlign !== "center" ? this.textAlign : null);
		var txAlStr = (txAlVal == null ? "" : "text-align:" + txAlVal + ";");
		var bobo = boxShadow + border + txAlStr;
			
		if (divQube != null && divQube.getElementsByClassName("qube-face").length === 6) {
			// start specific rendering, if six 'qube-face' class containers where already in this element class
			divQube.setAttribute("class", qclasses);
			divQube.style.width = sPx + "px";
			divQube.style.transform = "translateZ(-"+(this.sizePx/2)+"px)";
			divQube.style.transformOrigin = "50% " + hPx + "px";
			if (rotateStyle !== ""){ divQube.style.transform = rotateStyle; } 
			
			var transZ = ' translateZ('+hPx+'px)';
			buildSpecificFaceCase(bgcClr[0], "front", this.front, divQube, sPx, 'rotateY(0deg)'+transZ, shadeVal, borderVal, txAlVal);
			buildSpecificFaceCase(bgcClr[1], "back", this.back, divQube, sPx, 'rotateY(180deg)'+transZ, shadeVal, borderVal, txAlVal);
			buildSpecificFaceCase(bgcClr[2], "top", this.top, divQube, sPx, 'rotateX(90deg)'+transZ, shadeVal, borderVal, txAlVal);
			buildSpecificFaceCase(bgcClr[3], "bottom", this.bottom, divQube, sPx, 'rotateX(-90deg)'+transZ, shadeVal, borderVal, txAlVal);
			buildSpecificFaceCase(bgcClr[4], "left", this.left, divQube, sPx, 'rotateY(-90deg)'+transZ, shadeVal, borderVal, txAlVal);			
			buildSpecificFaceCase(bgcClr[5], "right", this.right, divQube, sPx, 'rotateY(90deg)'+transZ, shadeVal, borderVal, txAlVal);
			
			// define perspective wrapper - 'divQube' is the element that we wrap
			var par = divQube.parentNode;
			var wrapper = document.createElement('div');
			// set the wrapper as child (instead of the element) and define styles
			par.replaceChild(wrapper, divQube);
			wrapper.style.perspective = this.perspectivePx + 'px';
			wrapper.style.perspectiveOrigin = this.perspectiveOrigin;
			wrapper.classList.add("qube-wrap-perspective");
			// set element as child of wrapper
			wrapper.appendChild(divQube);
		} else if (divQube != null) {
			// build cube structure
			var alreadyStyles = divQube.getAttribute("style");
			var divQubeStart = '  <div id="'+this.id+'" class="'+qclasses+'" style="width:'+sPx+'px; transform-origin: 50% '+hPx+'px;'+initTransformStyle+alreadyStyles+'">\n';
			var divsQubeFaces = '    <div class="qube-face qube-front" style="width:'+sPx+'px;height:'+sPx+'px; transform: rotateY(0deg) translateZ('+hPx+'px);'+bgc[0]+bobo+'">'+this.front+'</div>\n'
				+ '    <div class="qube-face qube-back" style="width:'+sPx+'px;height:'+sPx+'px; transform: rotateY(180deg) translateZ('+hPx+'px);'+bgc[1]+bobo+'">'+this.back+'</div>\n'
				+ '    <div class="qube-face qube-top" style="width:'+sPx+'px;height:'+sPx+'px; transform: rotateX(90deg) translateZ('+hPx+'px);'+bgc[2]+bobo+'">'+this.top+'</div>\n'
				+ '    <div class="qube-face qube-bottom" style="width:'+sPx+'px;height:'+sPx+'px; transform: rotateX(-90deg) translateZ('+hPx+'px);'+bgc[3]+bobo+'">'+this.bottom+'</div>\n'
				+ '    <div class="qube-face qube-left" style="width:'+sPx+'px;height:'+sPx+'px; transform: rotateY(-90deg) translateZ('+hPx+'px);'+bgc[4]+bobo+'">'+this.left+'</div>\n'
				+ '    <div class="qube-face qube-right" style="width:'+sPx+'px;height:'+sPx+'px; transform: rotateY(90deg) translateZ('+hPx+'px);'+bgc[5]+bobo+'">'+this.right+'</div>\n';	
			var divQubeEnd = '  </div>\n';
			// define perspective wrapper
			var divWrapStart = '<div class="qube-wrap-perspective" style="perspective:'+this.perspectivePx+'px; perspective-origin:'+this.perspectiveOrigin+';">\n';
			var divWrapEnd = '</div>\n';
			
			var allDivs = divWrapStart + divQubeStart + divsQubeFaces + divQubeEnd + divWrapEnd;
			divQube.outerHTML = allDivs;
		} else {
			console.error("HTML div with id '"+this.id+"' not found. ");
			return;
		}
		
		// check for inputs disabling on faces
		if (this.disableUnpresentFaces) {
			handleUnpresentFaces(document.getElementById(this.id), currentFace);
		}
	};
	
	// set swipe action for swipe direction up/down/left/right/vertical/horizontal/general
	this.onSwipe = function(actionContent, swipeDirection) {
		if (swipeDirection == null) { swipeDirection = 'general'; }
		if (actionContent == null) { actionContent = ''; }
		else if (typeof actionContent === 'function') {
			// handle function type
			var fu = actionContent.toString();
			actionContent = fu.slice(fu.indexOf("{") + 1, fu.lastIndexOf("}"));
		}
		var d = swipeDirection.toLowerCase(), a = actionContent;
		
		if (d === "general") {
			onSwipeUpAct = a;
			onSwipeDownAct = a;
			onSwipeLeftAct = a;
			onSwipeRightAct = a;
		} else if (d === "vertical") {
			onSwipeUpAct = a;
			onSwipeDownAct = a
		} else if (d === "horizontal") {
			onSwipeLeftAct = a;
			onSwipeRightAct = a;
		} else if (d === "up") {
			onSwipeUpAct = a;
		} else if (d === "down") {
			onSwipeDownAct = a;
		} else if (d === "left") {
			onSwipeLeftAct = a;
		} else if (d === "right") {
			onSwipeRightAct = a;
		} else { console.error("Choose a valid swipeDirection: up/down/left/right/vertical/horizontal/general. "); }
	};
	
	// set after swipe action for swipe direction up/down/left/right/vertical/horizontal/general
	this.afterSwipe = function(actionContent, swipeDirection) {
		if (swipeDirection == null) { swipeDirection = 'general'; }
		if (actionContent == null) { actionContent = ''; }
		else if (typeof actionContent === 'function') {
			// handle function type
			var fu = actionContent.toString();
			actionContent = fu.slice(fu.indexOf("{") + 1, fu.lastIndexOf("}"));
		}
		var d = swipeDirection.toLowerCase(), a = actionContent;
		
		if (d === "general") {
			afterSwipeUpAct = a;
			afterSwipeDownAct = a;
			afterSwipeLeftAct = a;
			afterSwipeRightAct = a;
		} else if (d === "vertical") {
			afterSwipeUpAct = a;
			afterSwipeDownAct = a
		} else if (d === "horizontal") {
			afterSwipeLeftAct = a;
			afterSwipeRightAct = a;
		} else if (d === "up") {
			afterSwipeUpAct = a;
		} else if (d === "down") {
			afterSwipeDownAct = a;
		} else if (d === "left") {
			afterSwipeLeftAct = a;
		} else if (d === "right") {
			afterSwipeRightAct = a;
		} else { console.error("Choose a valid swipeDirection: up/down/left/right/vertical/horizontal/general. "); }
	};
	
	let setQubeFace = function(faceName, value) {
		var ele = document.getElementById(divId);
		if (ele == undefined) { console.error("undefined ID"); return; }
		var qele = ele.getElementsByClassName("qube-" + faceName);	
		if (qele[0] != null) { qele[0].innerHTML = value; }	
	};
	
	// use this setter method to reset the content
	this.setFront = function (value) { 
		this.front = value;
		setQubeFace("front", value);
	};
	
	this.setRight = function (value) {
		this.right = value;
		setQubeFace("right", value);
	};
	
	this.setBack = function (value) {
		this.back = value;
		setQubeFace("back", value);
	};
	
	this.setLeft = function (value) {
		this.left = value;
		setQubeFace("left", value);
	};
	
	this.setTop = function (value) {
		this.top = value;
		setQubeFace("top", value);
	};
	
	this.setBottom = function (value) {
		this.bottom = value;
		setQubeFace("bottom", value);
	};

	// moving to another initial defined cube side of the 3D cube
	this.moveToFace = function (faceName) { 
		var self = this;
		var cf = currentFace;	
		var mf = faceName; // moving to this face
		// check action lock
		if (this.actLock) {
			// handle next/last spin while another spin isn't finished
			// (all spin actions only work when each spin animation was finished)
			futureIdx++;
			var fi = -1;
			setTimeout(function(){
				if (fi === futureIdx) {
					self.moveToFace(faceName);
					futureIdx = 0;
				}
			}, this.spinDurationSeconds * 1000);
			fi = futureIdx;
			return;
		}
		this.actLock = true;		

		var ele = document.getElementById(this.id); 
		if (ele == null) { return; }

		if (!this.enableEventsWhileSpinning) { ele.style.pointerEvents = "none"; } 
		else {ele.style.pointerEvents = ""; }
		
		var trans = getRotationStyle(mf, this.sizePx);
		var initTrans = trans
		var isManipulatedTrans = false;
		// correction of shortest spin move
		if (cf === 'left' && mf === 'back') { 
			trans = "translateZ(-"+(this.sizePx/2)+"px) rotateY(180deg)";
			isManipulatedTrans = true;
		} else if (cf === 'back' && mf === 'left') {
			trans = "translateZ(-"+(this.sizePx/2)+"px) rotateY(-270deg)";
			isManipulatedTrans = true;
		}
		// set transform and transition styles
		ele.style.transition = "transform " + this.spinDurationSeconds+"s";
		ele.style.transitionTimingFunction = this.effect;
		ele.style.transform = trans;
	
		// handle currentFace and some styles after transition
		setTimeout(function(){
			var vom = document.getElementById(self.id); 
			currentFace = mf;
			self.actLock = false;
			vom.style.pointerEvents = "auto"; 
			if (isManipulatedTrans) {
				vom.style.transition = "";
				vom.style.transform = initTrans;
			}
		}, this.spinDurationSeconds * 1000);
		
		// check for inputs disabling on faces
		if (this.disableUnpresentFaces) {
			handleUnpresentFaces(ele, mf);
		}
	};
	
	let buildSpecificFaceCase = function(bgColor, faceName, thisFace, divQubeNode, sizePx, transform, boxShadow, border, textAlign) {
		var faceNode = divQubeNode.getElementsByClassName("qube-" + faceName)[0];
		if (faceNode != null) {
			faceNode.style.width = sizePx + "px";
			faceNode.style.height = sizePx + "px";
			faceNode.style.transform = transform;
			if (boxShadow != null) {
				faceNode.style.boxShadow = boxShadow;
			}
			if (border != null) {
				faceNode.style.border = border;
			}
			if (textAlign != null) {
				faceNode.style.textAlign = textAlign;
			}
			faceNode.style.backgroundColor = bgColor;
			// set face content if it exists, because we don't want to destroy initial existing EventListeners
			if (thisFace !== '') {
				faceNode.innerHTML = thisFace;
			}
		}
	};
	
	let buildDisableFaceCase = function(ele, presentFaceName, caseFaceName) {
		disableFace(ele.getElementsByClassName("qube-" + caseFaceName)[0], (presentFaceName !== caseFaceName ? true : false));
	};
	
	let handleUnpresentFaces = function(ele, presentFaceName) {
		// disable all unpresent faces, but not the target face 'presentFaceName' (enable new coming face)
		buildDisableFaceCase(ele, presentFaceName, "front");
		buildDisableFaceCase(ele, presentFaceName, "right");
		buildDisableFaceCase(ele, presentFaceName, "back");
		buildDisableFaceCase(ele, presentFaceName, "left");
		buildDisableFaceCase(ele, presentFaceName, "top");
		buildDisableFaceCase(ele, presentFaceName, "bottom");
	};
	
	this.addHeadCss = function (css) {
		var head = document.head || document.getElementsByTagName('head')[0];
		var style = document.createElement('style');

		head.appendChild(style);
		style.type = 'text/css';
		if (style.styleSheet){ 
		  // for some alternative/older browsers
		  style.styleSheet.cssText = css;
		} else {
		  style.appendChild(document.createTextNode(css));
		}
	};
	
	this.buildQubeCss = function () {
		var css = " .qube{ position: relative; margin: 0 auto; transform-style: preserve-3d; display: block; } "
		+ ".qube .qube-face{ position: absolute; text-align: center; box-shadow: inset 0 0 20px rgba(0,0,0,.2); box-sizing: border-box; }";

		this.addHeadCss(css);
	};
	
	if (!isQubeFaceCssAdded) {
		isQubeFaceCssAdded = true;
		this.buildQubeCss();
	}
	
	this.spinToFront = function () {
		this.moveToFace("front");
	};
	
	this.spinToRight = function () {
		this.moveToFace("right");
	};
	
	this.spinToBack = function () {
		this.moveToFace("back");
	};
	
	this.spinToLeft = function () {
		this.moveToFace("left");
	};
	
	this.spinToTop = function () {
		this.moveToFace("top");
	};
	
	this.spinToBottom = function () {
		this.moveToFace("bottom");
	};
	
	let getRotationStyle = function (faceName, size) {
		var mhPx = (size/2)*-1; // minus half qube face size
		var rotateStyle = null;
		faceName = faceName.toLowerCase();
		if (faceName === 'right') {
			rotateStyle = "translateZ("+mhPx+"px) rotateY(-90deg)";
		} else if (faceName === 'back') {
			rotateStyle = "translateZ("+mhPx+"px) rotateY(-180deg)";
		} else if (faceName === 'left') {
			rotateStyle = "translateZ("+mhPx+"px) rotateY(90deg)";
		} else if (faceName === 'top') {
			rotateStyle = "translateZ("+mhPx+"px) rotateX(-90deg)";
		} else if (faceName === 'bottom') {
			rotateStyle = "translateZ("+mhPx+"px) rotateX(90deg)";
		} else if (faceName === 'front') {
			rotateStyle = "translateZ("+mhPx+"px) rotateY(0deg)";
		}
		return rotateStyle;
	};
	
	// show face instantly
	this.showFaceInstantly = function (faceName) {
		if (faceName == null) { return; }
		var rotateStyle = getRotationStyle(faceName, this.sizePx);
		if (rotateStyle == null) { return; } // abort, because faceName must be a valid face name
		var ele = document.getElementById(this.id);
		if (ele == null) { return; }
		
		// set transform rotation and current face
		ele.style.transition = "";
		ele.style.transform = rotateStyle;
		currentFace = faceName.toLowerCase(); // just set valid face names as currentFace
		
		// check for inputs disabling on faces
		if (this.disableUnpresentFaces) {
			handleUnpresentFaces(ele, currentFace);
		}
	};
	
	// remove the cube
	this.remove = function () {
		var nodeElem = document.getElementById(this.id);
		if (nodeElem != null && nodeElem.parentElement != null) {
			nodeElem.parentElement.outerHTML = '';
		}
	};
	
	// fade out effect
	this.fadeOut = function () {
		var elC = document.getElementById(this.id)
		if (elC == null) { return; }
		var el = elC.parentElement;
		var op = 1;
		var timerFadeOut = setInterval(function () {
			if (op <= 0.1){
				clearInterval(timerFadeOut);
				el.style.display = 'none';
			}
			el.style.opacity = op;
			el.style.filter = 'alpha(opacity=' + op * 100 + ")";
			op -= op * 0.1;
		}, 20);
	};
	
	// fade in effect
	this.fadeIn = function () {
		var elC = document.getElementById(this.id)
		if (elC == null) { return; }
		var el = elC.parentElement;
		var op = 0.1;
		el.style.display = 'block';
		var timerFadeIn = setInterval(function () {
			if (op >= 1){
				clearInterval(timerFadeIn);
			}
			el.style.opacity = op;
			el.style.filter = 'alpha(opacity=' + op * 100 + ")";
			op += op * 0.1;
		}, 10);
	};
	
	// set node element and isDisabled=true for face input controls disabling
	let disableFace = function (node, isDisabled) {
		if (node == null) { return; }
		// instead of just disabling, use also a "data-origin-disabled" custom attribute, to remember if an element was already disabled before.
		var inputs = node.querySelectorAll("input, select, textarea, button"); // get all input controls
		var disOrig = "data-origin-disabled"; // mark if the input was already disabled
		var disQube = "data-qube-disabled"; // mark if we disabled the input by this function (we need this state because on initial state, the disabled state isn't clearly)
		for (var i = 0; i < inputs.length; i++) {
			var inp = inputs[i];
			// check for already origin disabled state
			if (isDisabled) { /* disable */
				if (inp.disabled && !inp.hasAttribute(disQube)) {
					inp.setAttribute(disOrig, 1);
				} else {
					// set automatic disabled state to true
					inp.disabled = true;
					inp.setAttribute(disQube, 1);
				}
			} else { /* re-enable */
				if (inp.hasAttribute(disOrig)) {
					inp.removeAttribute(disOrig);
					inp.disabled = true;
				} else if (inp.hasAttribute(disQube)) {
					// set automatic disabled state to false
					inp.disabled = false;
					inp.removeAttribute(disQube);
				}
			}		
		}	
	};
	
	// make an explosion effect and remove the cube
	this.explode = function (animTimeMsec, animEffect, particleDistancePx, isWithFadeOut) {
		// define default values of function parameters
		if (animTimeMsec == null){ animTimeMsec = 500; }
		if (animEffect == null){ animEffect = "ease-out"; }
		if (isWithFadeOut == null){ isWithFadeOut = true; }
		var hfa = "opacity:0.0;"; // has fade out
		if (!isWithFadeOut){ hfa = ""; }
		var dist = (particleDistancePx == null ? (this.sizePx / 4) : particleDistancePx) + (this.sizePx / 2);
		
		var ele = document.getElementById(this.id);
		if (ele == null) { return; }
		var self = this;
		
		// stop swipe and prevent inputs
		this.stopSwipe = true;
		handleUnpresentFaces(ele, null);
		
		var sPx = this.sizePx; // normal qube face size
		var hPx = sPx / 2; // half qube face size
		var eln = this.id;
		
		// add explosion animation CSS to the head (all faces move to there face-Z-direction)
		var css = "@keyframes explodeQubeFront_"+eln+"{ from{ transform: rotateY(0deg) translateZ("+hPx+"px); } to{ transform: rotateY(0deg) translateZ("+dist+"px); "+hfa+" }}"
		+ "@keyframes explodeQubeBack_"+eln+"{ from{ transform: rotateY(180deg) translateZ("+hPx+"px); } to{ transform: rotateY(180deg) translateZ("+dist+"px); "+hfa+" }}"
		+ "@keyframes explodeQubeTop_"+eln+"{ from{ transform: rotateX(90deg) translateZ("+hPx+"px); } to{ transform: rotateX(90deg) translateZ("+dist+"px); "+hfa+" }}"
		+ "@keyframes explodeQubeBottom_"+eln+"{ from{ transform: rotateX(-90deg) translateZ("+hPx+"px); } to{ transform: rotateX(-90deg) translateZ("+dist+"px); "+hfa+" }}"
		+ "@keyframes explodeQubeLeft_"+eln+"{ from{ transform: rotateY(-90deg) translateZ("+hPx+"px); } to{ transform: rotateY(-90deg) translateZ("+dist+"px); "+hfa+" }}"
		+ "@keyframes explodeQubeRight_"+eln+"{ from{ transform: rotateY(90deg) translateZ("+hPx+"px); } to{ transform: rotateY(90deg) translateZ("+dist+"px); "+hfa+" }}";
		this.addHeadCss(css);

		// add animation class
		var faces = ele.getElementsByClassName("qube-face");
		var i, len = faces.length, faceItem, cnBeforeAnim, tmpStyles; 
		var animKeyFrameNames = ["explodeQubeFront", "explodeQubeBack", "explodeQubeTop", "explodeQubeBottom", "explodeQubeLeft", "explodeQubeRight"];
		for (i = 0; i < len; i++) {
			faceItem = faces[i];
			cnBeforeAnim = faceItem.getAttribute("style");
			tmpStyles = "animation: "+(animKeyFrameNames[i]+"_"+eln)+" "+(animTimeMsec/1000)+"s "+animEffect+" 0.0s normal forwards;";
			tmpStyles += "pointer-events:none;";
			faceItem.setAttribute("style", cnBeforeAnim + ' ' + tmpStyles);
		}
		
		setTimeout(function(){
			self.remove();
		}, animTimeMsec);
	};
	
	// initialize infinity animation style (this overrides other animations)
	this.initInfiniteAnimation = function (animSeconds, animKeyFrameName) {
		var ele = document.getElementById(this.id); 
		if (ele == null) { return; }
		
		var mhPx = (this.sizePx / 2) * -1;
		var css = "@keyframes spinQubeX_"+this.id+"{ from{ transform: translateZ("+mhPx+"px) rotateX(0deg); } to{ transform: translateZ("+mhPx+"px) rotateX(360deg); }}"+
		+ "@keyframes spinQubeY_"+this.id+"{ from{ transform: translateZ("+mhPx+"px) rotateY(0deg); } to{ transform: translateZ("+mhPx+"px) rotateY(360deg); }}"
		+ "@keyframes spinQubeXN_"+this.id+"{ from{ transform: translateZ("+mhPx+"px) rotateX(360deg); } to{ transform: translateZ("+mhPx+"px) rotateX(0deg); }}"
		+ "@keyframes spinQubeYN_"+this.id+"{ from{ transform: translateZ("+mhPx+"px) rotateY(360deg); } to{ transform: translateZ("+mhPx+"px) rotateY(0deg); }}";
		this.addHeadCss(css);
		
		var cnBeforeAnim = ele.getAttribute("style");
		var tmpStyles = "animation: "+animKeyFrameName+"_"+this.id+" "+animSeconds+"s linear 0.0s normal infinite;";
		ele.setAttribute("style", cnBeforeAnim + ' ' + tmpStyles);
	};
	
	// infinte spinning the cube vertical (starts on front-face)
	this.autoSpinX = function (rotationSeconds, isSpinningRight, isRotatedBack) {
		// define default values of function parameters
		if (isSpinningRight == null){ isSpinningRight = true; }
		if (rotationSeconds == null){ rotationSeconds = 6; }
		if (isRotatedBack == null){ isRotatedBack = true; }
		autoSpinMode = 'X'; ap1 = isSpinningRight; ap2 = rotationSeconds; ap3 = isRotatedBack;
		
		this.initInfiniteAnimation(rotationSeconds, isSpinningRight ? "spinQubeXN" : "spinQubeX");
		
		if (isRotatedBack) {
			var eleQubeBack = document.getElementById(this.id).getElementsByClassName("qube-back")[0];
			if (eleQubeBack == null){ return; }
			eleQubeBack.style.transform = "translateZ("+((this.sizePx / 2) * -1)+"px) rotateY(180deg) rotateZ(180deg)";
		}
	};
	
	// infinte spinning the cube horizontal (starts on front-face)
	this.autoSpinY = function (rotationSeconds, isSpinningDown) {
		// define default values of function parameters
		if (isSpinningDown == null){ isSpinningDown = true; }
		if (rotationSeconds == null){ rotationSeconds = 6; }
		autoSpinMode = 'Y'; ap1 = rotationSeconds; ap2 = isSpinningDown;
		
		this.initInfiniteAnimation(rotationSeconds, isSpinningDown ? "spinQubeYN": "spinQubeY");
	};
	
	this.getCurrentFace = function () {
		return currentFace;
	};
	
	this.getId = function () {
		return this.id;
	};
	
	// enable swipe for touch and mouse-swipe - define the vertical/horizontal option initial (use the stop attributes to stop it temporary)
	this.enableSwipe = function (isSwipeVertical, isSwipeHorizontal, isGrabMouseCursor) { 
		// define default parameter values
		if (isSwipeVertical == null){ isSwipeVertical = true; } // enable vertical swipe as default, if swipe was enabled
		if (isSwipeHorizontal == null){ isSwipeHorizontal = true; } // enable horizontal swipe as default, if swipe was enabled
		if (isGrabMouseCursor == null){ isGrabMouseCursor = false; }
		var qe = this; // this qube element
		var eleQube = document.getElementById(qe.getId());
		if (eleQube == null){ return; }
		if (isGrabMouseCursor) {
			eleQube.style.cursor = "grab"; // use grab cursor 
		}	
		eleQube.addEventListener('touchstart', handleTouchStart, false);        
		eleQube.addEventListener('touchmove', handleTouchMove, false);
		eleQube.addEventListener('mousedown', handleMouseDown, false);        
		eleQube.addEventListener('mousemove', handleMouseMove, false);
		eleQube.addEventListener('mouseup', handleMouseUp, false);
		eleQube.style.userSelect = "none"; // disable user select effect for mouse-swipe
		
		var xDown = null;                                                        
		var yDown = null;
		var xDownM = null;                                                        
		var yDownM = null;
		var stopMouseMove = true;

		function getTouches(evt) {
		  return evt.touches || evt.originalEvent.touches; // browser API or jQ
		}                                                     

		function handleTouchStart(evt) {
			if (qe.stopSwipe) { return; }
			var firstTouch = getTouches(evt)[0];                                      
			xDown = firstTouch.clientX;                                      
			yDown = firstTouch.clientY;	                                   
		}                             

		function handleTouchMove(evt) {
			if ( qe.stopSwipe || ! xDown || ! yDown ) {
				return;
			}

			var xUp = evt.touches[0].clientX;                                    
			var yUp = evt.touches[0].clientY;

			var xDiff = xDown - xUp;
			var yDiff = yDown - yUp;
			
			swipeMostSignificant(xDiff, yDiff);
			
			/* reset values */
			xDown = null;
			yDown = null;                                             
		}
		
		function handleMouseDown(evt) {
			if (qe.stopSwipe) { return; }
			var firstMouseDown = evt;                                      
			xDownM = firstMouseDown.screenX;                                      
			yDownM = firstMouseDown.screenY; 
			stopMouseMove = false;
		}                                               

		function handleMouseMove(evt) {
			if ( qe.stopSwipe || stopMouseMove || ! xDownM || ! yDownM ) {
				return;
			}	

			var xUp = evt.screenX;                                    
			var yUp = evt.screenY;

			var xDiff = xDownM - xUp;
			var yDiff = yDownM - yUp;
			
			if (xDiff < 10 && yDiff < 10 && xDiff > -10 && yDiff > -10) {
				return;
			}
						
			swipeMostSignificant(xDiff, yDiff);
			
			/* reset values */
			xDownM = null;
			yDownM = null;	
		}
		
		function handleMouseUp(evt) {
			if (qe.stopSwipe) { return; }
			stopMouseMove = true;			
		}
		
		function swipeMostSignificant(xDiff, yDiff) {
			if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
				if (qe.stopSwipeY || !isSwipeHorizontal) { return; }
				if ( xDiff > 0 ) {
					/* left swipe */ 
					leftSwipe();
				} else {
					/* right swipe */
					rightSwipe();
				}                       
			} else {
				if (qe.stopSwipeX || !isSwipeVertical) { return; }
				if ( yDiff > 0 ) {
					/* up swipe */ 
					upSwipe();
				} else { 
					/* down swipe */
					downSwipe();
				}                                                                 
			}
		}
		
		function timeoutAct(content, seconds) {
			if (content !== "") { setTimeout(content, seconds*1000); }
		}

		function leftSwipe() {
			if (qe.stopSwipeLeft){ return; }
			if (onSwipeLeftAct !== ""){ eval(onSwipeLeftAct); }
			var cf = qe.getCurrentFace();
			/* left swipe */ 
			if (cf === 'front')
				qe.spinToRight();
			else if (cf === 'right')
				qe.spinToBack();
			else if (cf === 'back')
				qe.spinToLeft();
			else if (cf === 'left')
				qe.spinToFront();
			else if (cf === 'top')
				qe.spinToRight();
			else if (cf === 'bottom')
				qe.spinToRight();

			timeoutAct(afterSwipeLeftAct, spinAnimationSeconds);
		}

		function rightSwipe() {
			if (qe.stopSwipeRight){ return; }
			if (onSwipeRightAct !== ""){ eval(onSwipeRightAct); }
			var cf = qe.getCurrentFace();
			/* right swipe */ 
			if (cf === 'front')
				qe.spinToLeft();
			else if (cf === 'right')
				qe.spinToFront();
			else if (cf === 'back')
				qe.spinToRight();
			else if (cf === 'left')
				qe.spinToBack();
			else if (cf === 'top')
				qe.spinToLeft();
			else if (cf === 'bottom')
				qe.spinToLeft();

			timeoutAct(afterSwipeRightAct, spinAnimationSeconds);
		}
		
		function upSwipe() {
			if (qe.stopSwipeUp){ return; }
			if (onSwipeUpAct !== ""){ eval(onSwipeUpAct); }
			var cf = qe.getCurrentFace();
			/* up swipe */ 
			if (cf === 'front')
				qe.spinToBottom();
			else if (cf === 'right')
				qe.spinToBottom();
			else if (cf === 'back')
				qe.spinToBottom();
			else if (cf === 'left')
				qe.spinToBottom();
			else if (cf === 'top')
				qe.spinToFront();
			else if (cf === 'bottom')
				qe.spinToBack();

			timeoutAct(afterSwipeUpAct, spinAnimationSeconds);
		}
		
		function downSwipe() {
			if (qe.stopSwipeDown){ return; }
			if (onSwipeDownAct !== ""){ eval(onSwipeDownAct); }
			var cf = qe.getCurrentFace();
			/* down swipe */ 
			if (cf === 'front')
				qe.spinToTop();
			else if (cf === 'right')
				qe.spinToTop();
			else if (cf === 'back')
				qe.spinToTop();
			else if (cf === 'left')
				qe.spinToTop();
			else if (cf === 'top')
				qe.spinToBack();
			else if (cf === 'bottom')
				qe.spinToFront();
			
			timeoutAct(afterSwipeDownAct, spinAnimationSeconds);
		}
	};
	
	// calibrate perpective-origin style for cube size changes (example: "100px")
	this.recalibratePerspectiveOrigin = function(newHalfSize) {
		var e = document.getElementById(this.id);
		if (e == null) { return; }
		var wrapEle = e.parentElement;
		var p = wrapEle.style.perspectiveOrigin;
		if (p.indexOf(' ') >= 0) {
			p = p.substring(0, p.indexOf(' '));
		}
		wrapEle.style.perspectiveOrigin = p + ' ' + newHalfSize;
	};

	// reset transform part style (value example for translateX can be "100px" or for rotateX "90deg", transformPart example: "skew"/"translate"/"rotate"/"translateX"/"rotateZ"/...)
	// (tip: if we also set style "transition" before the call, then we can use an animated effect)
	this.resetTransformPart = function(node, transformPart, value, isAdditionalIfNotExist, transition) {
		var e = node;
		if (e == null) { return; }
		var tp = transformPart;
		if (tp == null) { tp = "translateZ";}
		var t = e.style.transform;
		var i1 = tp + '(';
		var i2 = ')';
		var startIdx = t.indexOf(i1);
		
		// optionally add or change transform transition style of this node
		if (transition != null) { e.style.transition = transition; }

		// replace transform part
		if (startIdx != -1) {
			var endIdx = t.indexOf(i2, startIdx) + 1;
			var s = t.substring(startIdx, endIdx);
			var tNew = i1 + value + i2;
			t = t.replace(s, tNew);
			e.style.transform = t;
		} else if (isAdditionalIfNotExist) {
			e.style.transform = t + ' ' + tp + '(' + value + ')';
		}
	};
	
	// resize cube
	this.resize = function(newSizePx) {
		var n = newSizePx;
		var hn = newSizePx / 2;
		var npx = n + "px";
		this.sizePx = n;
		var qu = document.getElementById(this.id);
		var qf = ["front", "back", "right", "left", "top", "bottom"]; // "qube-front", etc.
		
		// reset perspective origin
		this.recalibratePerspectiveOrigin(hn + "px");	
		
		// reset qube size
		this.resetTransformPart(qu, "translateZ", "-" + hn + "px", false, "");
		qu.style.width = npx;
		qu.style.transformOrigin = "50% " + hn + "px";
		
		// change each qube-face container
		var i, fa;
		for (i = 0; i < 6; i++) {
			fa = qu.getElementsByClassName("qube-" + qf[i])[0];
			this.resetTransformPart(fa, "translateZ", hn + "px", false, null);
			fa.style.width = npx;
			fa.style.height = npx;
		}
		
		// check for auto-spin
		if (autoSpinMode != null) {
			if (autoSpinMode === 'Y') {  
				this.autoSpinY(ap1, ap2);
			} else if (autoSpinMode === 'X') {  
				this.autoSpinX(ap1, ap2, ap3);
			}
		}
	};
}