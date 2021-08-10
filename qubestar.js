/*** QubeStar qubestar.js includes QubeControl/QubeItem and requires qubeface.js - QubeStar Version: 1.0.0 - Date: 05.04.2021 - Author: Ingmar Hedrich - QubeStar/QubeControl/QubeItem Licence: MIT ***/

/* QubeControl is a JavaScript extension library for QubeFace (to build interactive 3D cubes with four-direction-swipe) */
var qubeControlGlobals = []; // global QubeControl array

// ### QubeControl object constructor ### 
function QubeControl(obj) {
	
	this.id = null;
	this.effect = "ease-in-out";
	this.backgroundColor = "rgba(255,255,255,.85)";
	this.spinDurationSeconds = 0.4; // set spin duration default value
	this.sizePx = (this.sizePx == null ? 400 : this.sizePx);
	this.enableEventsWhileSpinning = false; // enable events while spinning (default is disabled, to prevent unwanted click/touch events)
	this.disableUnpresentFaces = false;
	this.borderWidth = 0; // border width in pixels as numeric value (0 means no border)
	this.borderColor = "rgba(0, 0, 0, 1.0)"; // border color (default: white)
	this.borderStyle = "solid"; // border style
	this.boxShadow = "inset 0 0 20px rgba(0,0,0,.2)"; // default boxShadow
	this.textAlign = "center"; // text-align 'center' as default for all faces
	this.perspectivePx = 800; // perspective depth
	this.perspectiveOrigin = null; // horizontal (in %) and vertical (in px) perspective as '50% 100px'
	
	this.items = [];
	this.stepIndex = 0;
	this.endElementContent = ""; // e.g.: "End", "✓", "" or something else
	this.isEndingWithExplosion = true; // ends with explosion as default

	this.upValues = []; // collect input values from swipe-up
	this.downValues = []; // collect input values from swipe-down
	this.rightValues = []; // collect input values from swipe-right
	this.leftValues = []; // collect input values from swipe-left
	
	// assign object properties
	if ("function" != typeof Object.assign) {
		for (var fld in obj) {
			if (obj.hasOwnProperty(fld)) { this[fld] = obj[fld]; }
		}
	} else { Object.assign(this, obj); }
	
	// set global values on object instantiation
	var qubeFa = {}; // QubeFace object
	var onEndContent = null;
	
	// set swipe action for swipe direction up/down/left/right/vertical/horizontal/general
	this.onSwipe = function(actionContent, swipeDirection) {
		if (swipeDirection == null) { swipeDirection = 'general'; }
		var a = actionContent, b, f = '';
		if (a == null) { a = ''; }
		else if (a != '') {
			a = funcStr(a);
		}
		var d = swipeDirection.toLowerCase();
		
		var isGeneral = false, isVertical = false, isHorizontal = false;
		if (d === "general") { isGeneral = true; }
		else if (d === "vertical") { isVertical = true; }
		else if (d === "horizontal") { isHorizontal = true; }
		
		if (isGeneral || isVertical || d === "up") {
			f = '; var s = qubeControlGlobals["'+this.id+'"]; var qubeFa = s.getQubeFace();' +
				's.pushDirectionValue("up", false);' +
				'qubeFa.setBottom(s.buildFaceContent(s.items[s.stepIndex]));';
			b = a + f;
			qubeFa.onSwipe(b, "up");
		} 
		if (isGeneral || isVertical || d === "down") {
			f = '; var s = qubeControlGlobals["'+this.id+'"]; var qubeFa = s.getQubeFace();' +
				's.pushDirectionValue("down", false);' +
				'qubeFa.setTop(s.buildFaceContent(s.items[s.stepIndex]));';
			b = a + f;
			qubeFa.onSwipe(b, "down");
		} 
		if (isGeneral || isHorizontal || d === "left") {
			f = '; var s = qubeControlGlobals["'+this.id+'"]; var qubeFa = s.getQubeFace();' +
				's.pushDirectionValue("left", false);' +
				'qubeFa.setRight(s.buildFaceContent(s.items[s.stepIndex]));';
			b = a + f;
			qubeFa.onSwipe(b, "left");
		} 
		if (isGeneral || isHorizontal || d === "right") {
			f = '; var s = qubeControlGlobals["'+this.id+'"]; var qubeFa = s.getQubeFace();' +
				's.pushDirectionValue("right", false);' +
				'qubeFa.setLeft(s.buildFaceContent(s.items[s.stepIndex]));';
			b = a + f;
			qubeFa.onSwipe(b, "right");
		} 
		if (f === '') { 
			console.error("Choose a valid swipeDirection as parameter for the onSwipe method: up/down/left/right/vertical/horizontal/general."); 
		}
	};
	
	// set after swipe action for swipe direction up/down/left/right/vertical/horizontal/general
	this.afterSwipe = function(actionContent, swipeDirection) {
		if (swipeDirection == null) { swipeDirection = 'general'; }
		var a = actionContent, b, f = '';
		if (a == null) { a = ''; }
		else if (a != '') {
			a = funcStr(a);
		}
		var d = swipeDirection.toLowerCase();
		
		var isGeneral = false, isVertical = false, isHorizontal = false;
		if (d === "general") { isGeneral = true; }
		else if (d === "vertical") { isVertical = true; }
		else if (d === "horizontal") { isHorizontal = true; }
		
		if (isGeneral || isVertical || d === "up") {
			f = 'var s = qubeControlGlobals["'+this.id+'"]; var qubeFa = s.getQubeFace(); s.processItemLocks("up");' +
				's.switchFrontFaceTo("bottom");' + // switch faces
				'qubeFa.setBottom(null);' +  // remove/reset moved face
				'qubeFa.showFaceInstantly("front");' +
				's.handleEnd();';
			b = f + a;
			qubeFa.afterSwipe(b, "up");
		} 
		if (isGeneral || isVertical || d === "down") {
			f = 'var s = qubeControlGlobals["'+this.id+'"]; var qubeFa = s.getQubeFace(); s.processItemLocks("down");' +
				's.switchFrontFaceTo("top");' +
				'qubeFa.setTop(null);' +
				'qubeFa.showFaceInstantly("front");' +
				's.handleEnd();';
			b = f + a;
			qubeFa.afterSwipe(b, "down");
		} 
		if (isGeneral || isHorizontal || d === "left") {
			f = 'var s = qubeControlGlobals["'+this.id+'"]; var qubeFa = s.getQubeFace(); s.processItemLocks("left");' +
				's.switchFrontFaceTo("right");' +
				'qubeFa.setRight(null);' +
				'qubeFa.showFaceInstantly("front");' +
				's.handleEnd();';
			b = f + a;
			qubeFa.afterSwipe(b, "left");
		} 
		if (isGeneral || isHorizontal || d === "right") {
			f = 'var s = qubeControlGlobals["'+this.id+'"]; var qubeFa = s.getQubeFace(); s.processItemLocks("right");' +
				's.switchFrontFaceTo("left");' +
				'qubeFa.setLeft(null);' +
				'qubeFa.showFaceInstantly("front");' +
				's.handleEnd();';
			b = f + a;
			qubeFa.afterSwipe(b, "right");
		} 
		if (f === '') {
			console.error("Choose a valid swipeDirection as parameter for the afterSwipe method: up/down/left/right/vertical/horizontal/general.");
		}
	};
	
	this.initSwiper = function () {
		qubeControlGlobals[this.id] = this;
		// set QubeFace properties
		qubeFa.backgroundColor = this.backgroundColor;
		qubeFa.spinDurationSeconds = this.spinDurationSeconds;
		
		// set first face content
		qubeFa.front = this.buildFaceContent(this.items[this.stepIndex], this);
		qubeFa.init();
		
		// enable swipe action
		qubeFa.enableSwipe(true, true, true);
		
		// handle swipe events
		this.onSwipe("", "left");
		this.afterSwipe("", "left");
		this.onSwipe("", "right");
		this.afterSwipe("", "right");
		this.onSwipe("", "down");
		this.afterSwipe("", "down");
		this.onSwipe("", "up");
		this.afterSwipe("", "up");
	
	};
	
	// define face content
	this.buildFaceContent = function(content) {
		var contentFace = "", val;
		var itm = content;
		// check for the end element
		if (this.items.length <= this.stepIndex) {
			contentFace = this.endElementContent;
		} else if (itm instanceof Object) {
			// handle QubeItem object value and content
			val = itm.value != null ? itm.value : "";
			contentFace = itm.content == null ? val : itm.content;
		} else {
			// value content
			contentFace = content;
		}

		return '<div id="qube_'+this.id+'_step'+this.stepIndex+'" class="qubeControl">'+contentFace+'</div>';
	};
	
	// handle swipe end
	this.handleEnd = function() {
		// check if swipe end was reached
		if (this.items.length <= this.stepIndex) {
			if (this.isEndingWithExplosion) {
				qubeFa.explode(); 
			} else {
				// stop swipe actions
				qubeFa.stopSwipe = true;
			}
			if (onEndContent != null && onEndContent != "") {
				eval(onEndContent);
			}
		}
	};
			
	// handle item locks
	this.processItemLocks = function(directionName) {
		var s = this, item = null;
		try {
			item = s.items[s.stepIndex];
		} catch (e) {
			return; // wrong index of items array
		}
		// abort if item is missing
		if (item == null) { return; }
		
	
		// determine interpreter locks properties
		if (item.lockUp) {
			qubeFa.stopSwipeUp = true;
		} else { qubeFa.stopSwipeUp = false; }
		if (item.lockDown) {
			qubeFa.stopSwipeDown = true;
		} else { qubeFa.stopSwipeDown = false; }
		if (item.lockLeft) {
			qubeFa.stopSwipeLeft = true;
		} else { qubeFa.stopSwipeLeft = false; }
		if (item.lockRight) {
			qubeFa.stopSwipeRight = true;
		} else { qubeFa.stopSwipeRight = false; }
	};
	
	// add custom actions at the end of the steps
	this.onEnd = function(actionContent) {
		if (typeof actionContent === 'function') {
			// handle function type
			var fu = actionContent.toString();
			actionContent = fu.slice(fu.indexOf("{") + 1, fu.lastIndexOf("}"));
		}
		onEndContent = actionContent;
	};

	// initialize qube
	this.init = function () {
		if (typeof QubeFace == "undefined") {
			console.error("QubeFace library not found. Import the QubeFace library before you import the QubeControl library.");
			return;
		}
		if (this.id == null || this.id === "") {
			console.error("No QubeControl ID was found. Define the element ID of a QubeControl object to solve the problem.");
			return;
		}
		if (this.items.length == 0) {
			console.error("No QubeControl item(s) found. Define one or more items on object instantiation with 'items', e.g.: new QubeControl({id:'myId', items:['Hi!', 'Step2']})");
			return;
		}
		
		// init QubeFace object
		qubeFa = new QubeFace(this); 
		
		// start swiper init
		this.initSwiper();
		
		// handle initial locks
		this.processItemLocks(null);
	};
	
	this.init();
		
	// use this setter method to reset the content
	this.setFront = function (value) { 
		qubeFa.setFront(value);
	};
	
	this.setRight = function (value) {
		qubeFa.setRight(value);
	};
	
	this.setBack = function (value) {
		qubeFa.setBack(value);
	};
	
	this.setLeft = function (value) {
		qubeFa.setLeft(value);
	};
	
	this.setTop = function (value) {
		qubeFa.setTop(value);
	};
	
	this.setBottom = function (value) {
		qubeFa.setBottom(value);
	};
	
	// show face instantly
	this.showFaceInstantly = function (faceName) {
		qubeFa.showFaceInstantly(faceName);
	};
	
	// remove the cube
	this.remove = function () {
		qubeFa.remove();
		qubeControlGlobals[this.id] = undefined;
	};

	this.clearItems = function () {
		this.items = [];
	};
	
	this.resetIndex = function () {
		this.stepIndex = 0;
	};
	
	// reset step index and direction values and restart with first item
	this.restart = function () {
		this.upValues = [];
		this.downValues = [];
		this.leftValues = [];
		this.rightValues = [];
		
		this.resetIndex();
		qubeFa.fadeIn();
		qubeFa.setFront(this.buildFaceContent(this.items[this.stepIndex], this));
	};
	
	// fade out effect
	this.fadeOut = function () {
		qubeFa.fadeOut();
	};
	
	// fade in effect
	this.fadeIn = function () {
		qubeFa.fadeIn();
	};
		
	// make an explosion effect and remove the cube
	this.explode = function (animTimeMsec, animEffect, particleDistancePx, isWithFadeOut) {
		qubeFa.explode(animTimeMsec, animEffect, particleDistancePx, isWithFadeOut);
	};
	
	this.getId = function () {
		return this.id;
	};
	
	// get QubeFace object
	this.getQubeFace = function () {
		return qubeFa;
	};
	
	// concat new items as array
	this.concatItems = function (arr) {
		this.items = this.items.concat(arr);
	};
	
	// stop or re-activate swipe 
	this.stopSwipe = function(isStopping) {
		if (isStopping == null) { isStopping = true; }
		qubeFa.stopSwipe = isStopping; 
	};
	this.stopSwipeX = function(isStopping) {
		if (isStopping == null) { isStopping = true; }
		qubeFa.stopSwipeX = isStopping; 
	};
	this.stopSwipeY = function(isStopping) {
		if (isStopping == null) { isStopping = true; }
		qubeFa.stopSwipeY = isStopping; 
	};
	this.stopSwipeRight = function(isStopping) {
		if (isStopping == null) { isStopping = true; }
		qubeFa.stopSwipeRight = isStopping; 
	};
	this.stopSwipeLeft = function(isStopping) {
		if (isStopping == null) { isStopping = true; }
		qubeFa.stopSwipeLeft = isStopping; 
	};
	this.stopSwipeUp = function(isStopping) {
		if (isStopping == null) { isStopping = true; }
		qubeFa.stopSwipeUp = isStopping; 
	};
	this.stopSwipeDown = function(isStopping) {
		if (isStopping == null) { isStopping = true; }
		qubeFa.stopSwipeDown = isStopping; 
	};
	
	// skip to next by ignoring the adding of values to the up/down/right/left arrays
	this.skipToNext = function(spinDirection) {
		this.spinToNext(spinDirection, true);
	};
	
	// spin to next by adding a value to the up/down/right/left array
	this.spinToNext = function(spinDirection, isSkipping) {
		var caseVal, sp = spinDirection, sk = isSkipping;
				
		// check for end 
		if (this.stepIndex + 1 > this.items.length) {
			return; 
		}
		var self = this;
		
		// blocking next spin action if action lock is still running
		if (qubeFa.actLock) {
			return;
		}
		
		// skipping the direction value arrays is 'false' as default
		if (sk == null) { sk = false; } 
		
		if (sp === 'down') {
			caseVal = 1;
			qubeFa.spinToTop();
			this.pushDirectionValue("down", sk);
			qubeFa.setTop(this.buildFaceContent(this.items[this.stepIndex]));
		} else if (sp === 'up') {
			caseVal = 2;
			qubeFa.spinToBottom();
			this.pushDirectionValue("up", sk);
			qubeFa.setBottom(this.buildFaceContent(this.items[this.stepIndex]));
		} else if (sp === 'right') { 
			caseVal = 3;
			qubeFa.spinToLeft();
			this.pushDirectionValue("right", sk);
			qubeFa.setLeft(this.buildFaceContent(this.items[this.stepIndex]));
		} else { // 'left' as default direction
			caseVal = 4;
			qubeFa.spinToRight(); 
			this.pushDirectionValue("left", sk);
			qubeFa.setRight(this.buildFaceContent(this.items[this.stepIndex]));
		}
		
		// switch face content
		setTimeout(function(){
			if (caseVal === 1) {
				self.processItemLocks('down');
				self.switchFrontFaceTo("top");
				qubeFa.setTop(null);
			} else if (caseVal === 2) {
				self.processItemLocks('up');
				self.switchFrontFaceTo("bottom");
				qubeFa.setBottom(null);
			} else if (caseVal === 3) {
				self.processItemLocks('right');
				self.switchFrontFaceTo("left");
				qubeFa.setLeft(null);
			} else if (caseVal === 4) {
				self.processItemLocks('left');
				self.switchFrontFaceTo("right");
				qubeFa.setRight(null);
			}
			qubeFa.showFaceInstantly("front");
			self.handleEnd();
		}, this.spinDurationSeconds * 1000);
	};
	
	// switch the front face by direction name of another face
	this.switchFrontFaceTo = function(directionName) {
		var res = "", dn = directionName;
		var ele = document.querySelector("#"+this.id+" .qube-"+dn);
		
		if (ele != null) { res = ele.innerHTML; } 
		else if (dn === 'top') { res = qubeFa.top; }
		else if (dn === 'bottom') { res = qubeFa.bottom; }
		else if (dn === 'right') { res = qubeFa.right; }
		else if (dn === 'left') { res = qubeFa.left; }
		
		qubeFa.setFront(res);
	};
	
	// get item index by item ID
	this.getItemIndex = function(itemId) {
		var i, v, len = this.items.length;
		for (i = 0; i < len; i++) {
			if (this.items[i].itemId === itemId) {
				v = i;
				break;
			}
		}
		return v;
	};
	
	// resize cube
	this.resize = function(newSizePx) {
		this.sizePx = newSizePx;
		qubeFa.resize(newSizePx);
	};
	
	// push value to a direction category (with item interpreter)
	this.pushDirectionValue = function(directionName, isSkipping) {
		var dn = directionName;
		var s = this, item = null, v = null;
		try {
			item = s.items[s.stepIndex];
		} catch (e) {
			return; // wrong index of items array
		}
		if (item == null) { return; }

		// don't set direction value when we just want to skip
		if (isSkipping != null && !isSkipping) {
			// get item value to set the direction value
			if (item instanceof Object) {
				// QubeItem value
				v = item.value;
			} else {
				// use item value as direction value
				v = item;
			}

			if (v != null) {
				if (dn === 'up') {	
					s.upValues.push(v);
				} else if (dn === 'down') {	
					s.downValues.push(v);
				} else if (dn === 'right') {	
					s.rightValues.push(v);
				} else if (dn === 'left') {	
					s.leftValues.push(v);
				}
			}
		}
		
		// handle trigger events
		if (dn === 'up' && item.onUp != null) { 
			eval(funcStr(item.onUp)); 
		} else if (dn === 'down' && item.onDown != null) { 
			eval(funcStr(item.onDown)); 
		} else if (dn === 'right' && item.onRight != null) { 
			eval(funcStr(item.onRight)); 
		} else if (dn === 'left' && item.onLeft != null) { 
			eval(funcStr(item.onLeft)); 
		}
		
		// handle jump conditions by item ID
		if (dn === 'up' && item.ifUpThenItemId != null) {
			this.stepIndex = s.getItemIndex(item.ifUpThenItemId);
		} else if (dn === 'down' && item.ifDownThenItemId != null) {
			this.stepIndex = s.getItemIndex(item.ifDownThenItemId);
		} else if (dn === 'right' && item.ifRightThenItemId != null) {
			this.stepIndex = s.getItemIndex(item.ifRightThenItemId);
		} else if (dn === 'left' && item.ifLeftThenItemId != null) {
			this.stepIndex = s.getItemIndex(item.ifLeftThenItemId);
		}
		// handle jump conditions by item index
		else if (dn === 'up' && item.ifUpThenIndex != null) {
			this.stepIndex = item.ifUpThenIndex;
		} else if (dn === 'down' && item.ifDownThenIndex != null) {
			this.stepIndex = item.ifDownThenIndex;
		} else if (dn === 'right' && item.ifRightThenIndex != null) {
			this.stepIndex = item.ifRightThenIndex;
		} else if (dn === 'left' && item.ifLeftThenIndex != null) {
			this.stepIndex = item.ifLeftThenIndex;
		} else {
			// set index to next item (default way)
			this.stepIndex++; 
		}
	};
	
	// filter content by converting function type as string
	function funcStr(content) {
		if (typeof content === 'function') {
			var fu = content.toString();
			content = fu.slice(fu.indexOf("{") + 1, fu.lastIndexOf("}"));
		}
		return content;
	}
	
}

// QubeItem object (for QubeControl and QubeStar)
function QubeItem(obj) {
	
	// common properties		
	this.itemId = null; // ID for item identification
	this.content = null; // text or HTML content of the displayed cube face
	this.value = null; // value of the item
	
	// control properties
	this.lockUp = false; // prevent up spin and selection
	this.lockLeft = false; // prevent left spin and selection
	this.lockRight = false; // prevent right spin and selection
	this.lockDown = false; // prevent down spin and selection
	this.ifUpThenItemId = null; // jump to itemId of the items array when up direction was selected
	this.ifLeftThenItemId = null // jump to itemId of the items array when left direction was selected
	this.ifRightThenItemId = null; // jump to itemId of the items array when right direction was selected
	this.ifDownThenItemId = null; // jump to itemId of the items array when down direction was selected
	this.ifUpThenIndex = null; // jump to items index of the items array when up direction was selected
	this.ifLeftThenIndex = null; // jump to items index of the items array when left direction was selected
	this.ifRightThenIndex = null; // jump to items index of the items array when right direction was selected
	this.ifDownThenIndex = null; // jump to items index of the items array when down direction was selected
	
	// control custom functions
	this.onUp = function(){}; // trigger event, when up direction was selected
	this.onLeft = function(){}; // trigger event, when left direction was selected
	this.onRight = function(){};  // trigger event, when right direction was selected
	this.onDown = function(){}; // trigger event, when down direction was selected

	// QubeStar properties
	this.up = null; // up content as text or HTML (null = takes the content from before)
	this.left = null; // left content as text or HTML (null = takes the content from before)
	this.right = null; // right content as text or HTML (null = takes the content from before)
	this.down = null; // down content as text or HTML (null = takes the content from before)
	this.holdDirectionContent = false; // hold all four direction contents by setting current item contents (which aren't null) as QubeStar direction content if it's true.
	
	// assign object properties
	if ("function" != typeof Object.assign) {
		for (var fld in obj) {
			if (obj.hasOwnProperty(fld)) { this[fld] = obj[fld]; }
		}
	} else { Object.assign(this, obj); }
}

/* QubeStar is a JavaScript extension library to build a star board for a cube (this cube is a QubeControl based on QubeFace) */
var isQubeStarCssAdded = false;
var qubeStarGlobals = []; // global QubeStar array

// ### QubeStar object constructor ### 
function QubeStar(obj) {
 
	this.qubeControl = null;
	this.id = null;
	this.arrowColor = "rgba(144, 238, 144, 0.5)";
	this.arrowFocusColor = "#B0E0E6";
	this.upLabel = ""; // up label content as text or HTML
	this.downLabel = ""; // down label content as text or HTML
	this.rightLabel = ""; // right label content as text or HTML
	this.leftLabel = ""; // left label content as text or HTML
	this.isUpLabelCentric = false; // enable centered label for the up part (default is 'false')
	this.isDownLabelCentric = false; // enable centered label for the down part (default is 'false')
	this.isRightLabelCentric = false; // enable centered label for the right part (default is 'false')
	this.isLeftLabelCentric = false; // enable centered label for the left part (default is 'false')
	this.boardSizePx = null; // star board size in pixels
	this.arrowWidthPercent = null; // direction arrows width in percent (0 till 100)
	this.arrowHeightPercent = null; // direction arrows height in percent (0 till 100)
	this.arrowTranslate = null; // translate direction arrows up or down (between -50 till 90)
	this.hasClickableArrows = true; // enable clickable arrows as default (by special overlay), otherwise just the arrow text is clickable
	this.isPagingMode = false; // this determines the direction button effect of the cube spinning as paging mode or categorize mode (default is 'false')
	
	// assign object properties
	if ("function" != typeof Object.assign) {
		for (var fld in obj) {
			if (obj.hasOwnProperty(fld)) { this[fld] = obj[fld]; }
		}
	} else { Object.assign(this, obj); }
	
	var csz; // cube size in px
	var qubeFa = {}; // QubeFace object
	
	// short query selector
	function qSel(p) {
		return document.querySelector(p);
	}
	
	// short query all selector 
	function qSelAll(p) {
		return document.querySelectorAll(p);
	}
	
	// direction interpreter head
	function dirInterpreterHead(qubeControlId) {
		return ';var e = null, eo = null, s = qubeControlGlobals["'+qubeControlId+'"]; var si = s.stepIndex + 1; if(s.items != null && s.items.length == si){ si = 0; } ';
	}
	
	// create action of the buttons for the direction disabling
	function directionDisablingInterpreter(direction, qubeStarId, qubeControlId) {
		var dirUpcase = (direction.charAt(0).toUpperCase() + direction.slice(1));
		return ';e = document.querySelector("#'+qubeStarId+' .qubeArrow'+dirUpcase+'Wrap .qubeStarLabel"); eo = document.querySelector("#'+qubeStarId+' .qubeArrow'+dirUpcase+'Overlay");' +
		'if(e != null && s.items.length > 0 && s.items[si] != null && s.items[si].lock'+dirUpcase+' != null && s.items[si].lock'+dirUpcase+')' +
		'{ e.disable = true; e.style.visibility="hidden"; var dArrow = document.querySelector("#'+qubeStarId+' .qubeArrow'+dirUpcase+'"); if(dArrow!=null){ dArrow.style.visibility = "hidden"; } ' +
		' if(eo != null){ eo.style.cursor="default"; }' +
		'} else if(e != null){ e.disable = false; e.style.visibility="visible"; var dArrow = document.querySelector("#'+qubeStarId+' .qubeArrow'+dirUpcase+'"); ' +
		'if(dArrow != null){ dArrow.style.visibility = "visible"; } if(eo != null){ eo.style.cursor="pointer"; } }';
	}
		
	// create action of the buttons for the direction content
	function directionContentInterpreter(direction, qubeStarId, qubeControlId) {
		return ';e = document.querySelector("#'+qubeStarId+' .qubeArrow'+(direction.charAt(0).toUpperCase()+direction.slice(1))+'Wrap .qubeStarLabel"); ' +
		'if(e != null && s.items.length > 0 && s.items[si] != null && s.items[si].'+direction+' != null){ e.innerHTML = s.items[si].'+direction+'; ' +
		'if(s.items[si].holdDirectionContent){ qubeStarGlobals["'+qubeStarId+'"].'+direction+'Label = s.items[si].'+direction+';} ' +
		'} else if(e != null){ e.innerHTML = qubeStarGlobals["'+qubeStarId+'"].'+direction+'Label; }';
	}
	
	// handle direction button disabling of the item (QubeItem) iterpreter
	function dirDisablingCheckAll(qubeStarId, qubeControlId) {
		var id = qubeStarId, qcID = qubeControlId;
		return dirInterpreterHead(qcID) 
		+ directionDisablingInterpreter('up', id, qcID)
		+ directionDisablingInterpreter('down', id, qcID)
		+ directionDisablingInterpreter('left', id, qcID)
		+ directionDisablingInterpreter('right', id, qcID);
	}
	
	// handle direction content changes of the item (QubeItem) iterpreter
	function dirContentCheckAll(qubeStarId, qubeControlId) {
		var id = qubeStarId, qcID = qubeControlId;
		return ';var e = null, s = qubeControlGlobals["'+qcID+'"]; var si = s.stepIndex; ' 
		+ directionContentInterpreter('up', id, qcID)
		+ directionContentInterpreter('down', id, qcID)
		+ directionContentInterpreter('left', id, qcID)
		+ directionContentInterpreter('right', id, qcID);
	}
	
	// set QubeStar swipe action for swipe direction up/down/left/right/vertical/horizontal/general
	this.onSwipe = function(actionContent, swipeDirection) {
		if (swipeDirection == null) { swipeDirection = 'general'; }
		var d = swipeDirection.toLowerCase(), a = '', qcID = this.qubeControl.id;
		
		if (d === 'up' || d === 'down' || d === 'right' || d === 'left') {
			// read current QubeItem by stepIndex and disable direction button, hide SVG arrow and text if disabling was defined
			// and register always all directions cases for each direction content
			a = dirDisablingCheckAll(this.id, qcID);
		}
		
		actionContent = a + ';' + actionContent;
		this.qubeControl.onSwipe(actionContent, swipeDirection);
	};
	
	// set QubeStar after swipe action for swipe direction up/down/left/right/vertical/horizontal/general
	this.afterSwipe = function(actionContent, swipeDirection) {
		if (swipeDirection == null) { swipeDirection = 'general'; }
		var d = swipeDirection.toLowerCase(), a = '', qcID = this.qubeControl.id;

		if (d === 'up' || d === 'down' || d === 'right' || d === 'left') {
			// read current QubeItem by stepIndex and set new direction content if it exists
			// and register always all directions cases for each direction content
			a = dirContentCheckAll(this.id, qcID);
		}

		actionContent = a + ';' + actionContent;
		this.qubeControl.afterSwipe(actionContent, swipeDirection);
	};
	
	// skip to next item by ignoring the adding of values to the up/down/right/left arrays
	this.skipToNext = function(spinDirection) {
		this.qubeControl.spinToNext(spinDirection, true);
	};
	
	// spin to next item by setting up/down/right/left as spin direction
	this.spinToNext = function(spinDirection, isSkipping) {
		if (spinDirection == null) { spinDirection = 'left'; }
		var sp = spinDirection.toLowerCase(), qcID = this.qubeControl.id, a = '', b = '';
		
		// skipping the direction value arrays is 'false' as default
		if (isSkipping == null) { isSkipping = false; }
		
		// prevent spinning for locks (by checking swipe stop) for lock interpreter
		if (('up' === sp && qubeFa.stopSwipeUp) || ('down' === sp && qubeFa.stopSwipeDown) 
			|| ('left' === sp && qubeFa.stopSwipeLeft) || ('right' === sp && qubeFa.stopSwipeRight)) {
			return;
		}

		// handle direction button disabling of the item (QubeItem) iterpreter
		a = dirDisablingCheckAll(this.id, qcID);
		eval(a);

		// handle direction content changes of the item (QubeItem) iterpreter
		b = dirContentCheckAll(this.id, qcID);
		setTimeout( function(){ eval(b); }, this.qubeControl.spinDurationSeconds * 1000);

		this.qubeControl.spinToNext(sp, isSkipping);
	};
	
	// add CSS classes to head
	this.buildBoardCss = function () {
		if (qubeFa == null) { return; }

		var css = " .qubeStarRow { text-align:center; width:100%; position:relative; } "
		+ ".qubeStarCenter { display: inline-block; } "
		+ ".qubeVerticalCenter { margin: 0; position: absolute; top: 50%; transform: translateY(-50%); } "
		+ ".qubeStarLabel { margin: 0 2px; user-select: none; -webkit-touch-callout: none; user-drag: none; } "
		+ ".qubeArrowUpOverlay, .qubeArrowDownOverlay, .qubeArrowLeftOverlay, .qubeArrowRightOverlay { cursor:pointer; user-select: none; -webkit-touch-callout: none; user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); } "
		+ "button.qubeStarLabel { background-color:transparent;color: inherit;border: none;padding: 0;font:inherit;cursor:pointer;text-align:inherit;user-drag:none;outline:inherit; } "
		+ "button.qubeStarLabel:hover { outline-style:dotted; outline-color: inherit; outline-width: 2px; outline-offset: 0; } "
		+ ".qubeStar .qubeControl { height:inherit;width:inherit;display:table-cell;vertical-align: middle;text-align:center;margin:auto; } ";
		
		qubeFa.addHeadCss(css);
		isQubeStarCssAdded = true;
	};
	
	// render arrow triangles for the star as SVG polygons
	this.renderStarSvg = function() {
		
		var bS = this.boardSizePx;
		var clr = this.arrowColor;
		var offsetArrowHeight; // this defines the arrow height offset
		var offsetArrowWidth; // this defines the arrow width offset
		var offsetTranslate = 0; // translate arrow up or down with this offset
		
		var arrowWidthPercent = this.arrowWidthPercent == null ? 100 : this.arrowWidthPercent;
		var arrowHeightPercent = this.arrowHeightPercent == null ? 100 : this.arrowHeightPercent;
		var arrowTranslate = this.arrowTranslate == null ? 0 : this.arrowTranslate;
		
		// calculate offset by percent input parameters
		var arrow100Percent = bS / 3;
		if (arrowWidthPercent == null || arrowWidthPercent == arrow100Percent) { 
			offsetArrowWidth = 0; 
		} else {
			offsetArrowWidth = (arrow100Percent - (arrowWidthPercent * (arrow100Percent/100))) / 2;
		}
		if (arrowHeightPercent == null || arrowHeightPercent == arrow100Percent) { 
			offsetArrowHeight = 0; 
		} else {
			offsetArrowHeight = arrow100Percent - (arrowHeightPercent * (arrow100Percent/100));
		}
		if (arrowTranslate != null) { offsetTranslate = arrowTranslate; }
		
		var aW = bS / 3; // arrow width unit
		var p1x=0, p1y=aW, p2x=aW/2, p2y=0, p3x=aW, p3y=aW;
		var poly1, poly2, poly3, poly4;
		p2y = p2y + offsetArrowHeight;
		p1x = p1x + offsetArrowWidth;
		p3x = p3x - offsetArrowWidth;
		var poly1TranslateX = aW,
		poly1TranslateY = 0 - offsetTranslate,
		poly2TranslateX = 0 - offsetTranslate,
		poly2TranslateY = aW * 2,
		poly3TranslateX = bS + offsetTranslate,
		poly3TranslateY = aW,
		poly4TranslateX = aW * 2,
		poly4TranslateY = bS + offsetTranslate;
		
		var polygonPoints = p1x + "," + p1y + " " + p2x + "," + p2y + " " + p3x + "," + p3y;
		
		poly1 = triangleSvg("qubeArrowUp", polygonPoints, clr, poly1TranslateX, poly1TranslateY, 0);
		poly2 = triangleSvg("qubeArrowLeft", polygonPoints, clr, poly2TranslateX, poly2TranslateY, 270);
		poly3 = triangleSvg("qubeArrowRight", polygonPoints, clr, poly3TranslateX, poly3TranslateY, 90);
		poly4 = triangleSvg("qubeArrowDown", polygonPoints, clr, poly4TranslateX, poly4TranslateY, 180);

		var e = qSel("#" + this.id + " .qubeStarLayer1");
		e.innerHTML = '<svg height="'+bS+'" width="'+bS+'">'+poly1+poly2+poly3+poly4+'</svg>';
		
		// render clickable arrows by overlay SVG, if flag was enabled
		if (this.hasClickableArrows) {
			var c = "transparent", eo, isPa = this.isPagingMode;
			poly1 = triangleSvg("qubeArrowUpOverlay", polygonPoints, c, poly1TranslateX, poly1TranslateY, 0, getArrowOverlayAction(this.id, isPa ? 'down' : 'up', 'Up'));
			poly2 = triangleSvg("qubeArrowLeftOverlay", polygonPoints, c, poly2TranslateX, poly2TranslateY, 270, getArrowOverlayAction(this.id, isPa ? 'right' :'left', 'Left'));
			poly3 = triangleSvg("qubeArrowRightOverlay", polygonPoints, c, poly3TranslateX, poly3TranslateY, 90, getArrowOverlayAction(this.id, isPa ? 'left' : 'right', 'Right'));
			poly4 = triangleSvg("qubeArrowDownOverlay", polygonPoints, c, poly4TranslateX, poly4TranslateY, 180, getArrowOverlayAction(this.id, isPa ? 'up' :'down', 'Down'));

			eo = qSel("#" + this.id + " .qubeStarLayer3");
			if (eo != null) {
				eo.innerHTML = '<svg height="'+bS+'" width="'+bS+'">'+poly1+poly2+poly3+poly4+'</svg>';
			}
		}
	};
	
	function triangleSvg(className, polygonPoints, color, translateX, translateY, rotate, onclickContent) {
		return '<polygon class="'+className+'" points="' + polygonPoints + '" fill="'+color+
		'" transform="translate('+translateX+','+translateY+') rotate('+rotate+')" onclick="'+onclickContent+'" />';
	}
	
	function getArrowOverlayAction(qubeStarId, spinDirection, dirUpcaseFocus) {
		return "document.querySelector('#"+qubeStarId+" .qubeArrow"+dirUpcaseFocus+"Wrap .qubeStarLabel').focus();" +
		" qubeStarGlobals['"+qubeStarId+"'].spinToNext('"+spinDirection+"');"
	}
	
	// render text container with arrow and inner content
	function renderTextDiv(starId, controlId, direction, arrowClass, arrowClr, arrowFocusClr, arrowContent, btnWrapDivStyle, isVerticalAlign) { // e.g. for parameters: 'myId_qubeStar', 'myQubeControlId', 'up', 'qubeArrowUp', '#B0E0E6', 'rgba(144, 238, 144, 0.5)', 'This goes up', '', true
		var lblDiv = '<div class="'+arrowClass+'Wrap'+(isVerticalAlign ? " qubeVerticalCenter" : "")+'" style="'+btnWrapDivStyle+'">' +
			'<button class="qubeStarLabel" onclick="qubeStarGlobals[\''+starId+'\'].spinToNext(\'' + direction + '\');" ' +
			' onfocus="document.querySelectorAll(\'#' + starId + ' .' + arrowClass + '\')[0].setAttribute(\'fill\',\''+arrowFocusClr+'\');" ' +
			' onblur="document.querySelectorAll(\'#' + starId + ' .' + arrowClass + '\')[0].setAttribute(\'fill\',\''+arrowClr+'\');">'+
			arrowContent+'</button></div>';
		return lblDiv;
	}
	
	function wrapLblDiv(content) {
		return '<div style="width:100%;height:100%;position:absolute;">'+content+'</div>';
	}
	
	// hide a SVG arrow by style class
	function hideArrow(arrowClass, id, isClickableArrow) {
		var el = qSel("#"+id+" ." + arrowClass);
		if (el != null) { el.style.visibility = 'hidden'; }
		
		if (isClickableArrow) {
			var eo = qSel("#"+id+" ." + arrowClass +"Overlay");
			if (eo != null) { eo.style.cursor = 'default'; }
		}
	}
	
	// return if SVG arrow is hidden by style class
	function isArrowHidden(arrowClass, id) {
		return qSel("#"+id+" ." + arrowClass).style.visibility === 'hidden';
	}
	
	// render whole star board
	this.renderStarBoard = function() {

		var qubeDiv = document.getElementById(this.qubeControl.id).parentElement;
		var bS = this.boardSizePx;	

		// calculate top offset and arrow margin offset for the cube centering
		var boardRowHeight =  Number((bS/3).toFixed(2));
		var topMainOffset = -14.6;
		var arrowMarginOffset = (boardRowHeight - csz) / 2;
		var topOffset = arrowMarginOffset + topMainOffset;
		var sideArrowsWidthPercent = Number((((bS - csz)/2) / bS * 100).toFixed(2));
		var clickBoardOffset = boardRowHeight - ((csz - boardRowHeight) / 2);
		
		var cubeStr = qubeDiv.outerHTML;
		var starBoardStart = '<div id="' + this.id + '" class="qubeStar" style="width:' + bS + 'px; height:' + bS + 'px;">';
		var starBoardEnd = '</div>';
		
		// blur all arrows which have a button focus on swipe start
		var onTouchI = "var qSL_btns=document.querySelectorAll('#"+this.id+" .qubeStarLabel'); var iqSL=0; for(iqSL=0;iqSL<qSL_btns.length;iqSL++){qSL_btns[iqSL].blur();}";
		var qubeInterfaceStart = '<div class="qubeControlInterface" style="position:relative;top:'+topOffset+'px;z-index:1;" ontouchstart="'+onTouchI+'">';
		var qubeInterfaceEnd = '</div>';
		
		var middleCellStart = '<div class="qubeStarCenter" style="width:' + csz + 'px;">';
		var middleCellEnd = '</div>';
		
		var boardLayer1 = '<div class="qubeStarLayer1" style="width:' + bS + 'px;height:' + bS + 'px;position:absolute;"></div>';
		var boardLayer2Start = '<div class="qubeStarLayer2" style="width:' + bS + 'px;height:' + bS + 'px;position:absolute;">';
		var boardLayer2End = '</div>';
		// add layer 3 only for clickable arrows
		var boardLayer3 = !this.hasClickableArrows ? '' : '<div class="qubeStarLayer3" style="width:' + bS + 'px;height:' + bS + 'px;position:absolute;top:-'+clickBoardOffset+'px;left:-'+clickBoardOffset+'px;"></div>';

		var boardRowStart = '<div class="qubeStarRow" style="height:' + boardRowHeight + 'px;">';
		var boardRowEnd = '</div>';
		
		var marginLblPx = 8 - arrowMarginOffset;
		// default positions and margins for the direction labels
		var upLblPos = 'margin-bottom:'+marginLblPx+'px;bottom:0;';
		var downLblPos = 'margin-top:'+marginLblPx+'px;';
		var rightLblPos = 'text-align:left;';
		var leftLblPos = 'text-align:right;';
		var tac = 'text-align:center;';
		
		if (this.isUpLabelCentric) {
			upLblPos = 'top:50%;';
		}
		if (this.isDownLabelCentric) {
			downLblPos = 'top:25%;';
		}
		if (this.isRightLabelCentric) {
			rightLblPos = tac;
		}
		if (this.isLeftLabelCentric) {
			leftLblPos = tac;
		}
		var qcId = this.qubeControl.id, clr = this.arrowColor, fclr = this.arrowFocusColor, siP = sideArrowsWidthPercent, hCli = this.hasClickableArrows;
		
		// handle first item (QubeItem) direction content of the item interpreter
		var itms = this.qubeControl.items, itm;
		var hasFirstItem = (itms != null && itms.length > 0 && itms[0] != null);
		if (hasFirstItem) { itm = itms[0]; }
		
		// handle initial direction content holding flag
		if (hasFirstItem && itm.holdDirectionContent) {
			if (itm.up != null) { this.upLabel = itm.up; }
			if (itm.down != null) { this.downLabel = itm.down; }
			if (itm.right != null) { this.rightLabel = itm.right; }
			if (itm.left != null) { this.leftLabel = itm.left; }
		}
		
		// set the item properties with priority otherwise use the QubeStar labels
		var upContent = hasFirstItem && itm.up != null ? itm.up : this.upLabel;
		var downContent = hasFirstItem && itm.down != null ? itm.down : this.downLabel;
		var rightContent = hasFirstItem && itm.right != null ? itm.right : this.rightLabel;
		var leftContent = hasFirstItem && itm.left != null ? itm.left : this.leftLabel;
		
		// handle initial disabling for direction content
		if (hasFirstItem) {
			if (itm.lockUp){ upContent = ""; }
			if (itm.lockDown){ downContent = ""; }
			if (itm.lockRight){ rightContent = ""; }
			if (itm.lockLeft){ leftContent = ""; }
		}
		
		var isPa = this.isPagingMode;
		// set direction content
		var upTextDiv = wrapLblDiv(renderTextDiv(this.id, qcId, isPa ? 'down' : 'up', 'qubeArrowUp', clr, fclr, upContent, 'width:100%;position:absolute;'+upLblPos, false));
		var leftTextDiv = renderTextDiv(this.id, qcId, isPa ? 'right' : 'left', 'qubeArrowLeft', clr, fclr, leftContent, 'width:' + siP + '%;'+leftLblPos, true);
		var rightTextDiv = renderTextDiv(this.id, qcId, isPa ? 'left' : 'right', 'qubeArrowRight', clr, fclr, rightContent, 'width:' + siP + '%;margin-left:' + (100 - siP) + '%;'+rightLblPos, true);
		var downTextDiv = wrapLblDiv(renderTextDiv(this.id, qcId, isPa ? 'up' : 'down', 'qubeArrowDown', clr, fclr, downContent, 'width:100%;text-align:center;position:relative;'+downLblPos, false));

		var row1Content = upTextDiv;
		var row2Content = wrapLblDiv(leftTextDiv + rightTextDiv) + middleCellStart + qubeInterfaceStart +
			boardLayer3 + cubeStr + 
			qubeInterfaceEnd + middleCellEnd;
		var row3Content = downTextDiv;

		var allContent = starBoardStart + boardLayer1 + 
			boardLayer2Start + 
			boardRowStart + row1Content + boardRowEnd + 
			boardRowStart + row2Content + boardRowEnd + 
			boardRowStart + row3Content + boardRowEnd + 
			boardLayer2End + starBoardEnd;
		
		// append star board around the cube
		qubeDiv.outerHTML = allContent;
		
		// render qube star as SVG
		this.renderStarSvg();
		
		// handle initial disabling for SVG arrows
		if (hasFirstItem) {
			if (itm.lockUp){ hideArrow("qubeArrowUp", this.id, hCli); }
			if (itm.lockDown){ hideArrow("qubeArrowDown", this.id, hCli); }
			if (itm.lockRight){ hideArrow("qubeArrowRight", this.id, hCli); }
			if (itm.lockLeft){ hideArrow("qubeArrowLeft", this.id, hCli); }
		}
		
		// re-enable swipe after DOM update, because the update removed the event listeners
		qubeFa.enableSwipe(true, true, true);
	};
	
	this.init = function() {
		if (typeof QubeFace == "undefined") {
			console.error("QubeFace library not found. Import the QubeFace library before you import the QubeControl library.");
			return;
		}
		if (typeof QubeControl == "undefined") {
			console.error("QubeControl library not found. Import the QubeControl library before you import the QubeStar library.");
			return;
		}
		
		// create QubeControl object instance, if not already exist
		if (this.qubeControl == null) {
			console.error("No QubeControl found. Define a QubeControl object for this QubeStar.");
			return;
		} else if (this.qubeControl instanceof Object && !(this.qubeControl instanceof QubeControl)) {
			this.qubeControl = new QubeControl(this.qubeControl);
		}
		
		if (this.id == null || this.id === this.qubeControl.id) {
			this.id = this.qubeControl.id + "_qubeStar";
		}
		
		this.boardSizePx = this.boardSizePx == null ? this.qubeControl.sizePx * 3 : this.boardSizePx;
		csz = this.qubeControl.sizePx;
		qubeFa = this.qubeControl.getQubeFace();
		
		if (!isQubeStarCssAdded) {
			this.buildBoardCss();
		}
		
		// check to big cube size for star board
		if (csz > this.boardSizePx - 50) {
			console.error("The cube size is to big for the QubeStar board. Define a bigger boardSizePx or a smaller QubeControl sizePx.");
			return;
		}
		
		// init board container rendering
		this.renderStarBoard();
		
		// handle QubeStar swipe events
		this.onSwipe("", "left");
		this.afterSwipe("", "left");
		this.onSwipe("", "right");
		this.afterSwipe("", "right");
		this.onSwipe("", "down");
		this.afterSwipe("", "down");
		this.onSwipe("", "up");
		this.afterSwipe("", "up");
		
		qubeStarGlobals[this.id] = this;
	};
	
	this.init();
	
	// resize method to resize the star board which also resizes the inner cube (QubeControl resize)
	this.resize = function(newBoardSizePx, isScalingCubeBySameRelation) {
		if (isScalingCubeBySameRelation == null) { isScalingCubeBySameRelation = true; }
			
		var oldCsz = this.qubeControl.sizePx, id = this.id, i, bS = newBoardSizePx, hCli = this.hasClickableArrows;
		var oldBoardSize = this.boardSizePx;
		this.boardSizePx = bS;
		var sizePercent = (bS/oldBoardSize) * 100;
		
		// preserve hidden SVG arrows
		var isHiddenUp = false, isHiddenDown = false, isHiddenLeft = false, isHiddenRight = false;
		if (isArrowHidden("qubeArrowUp", id)) { isHiddenUp = true; }
		if (isArrowHidden("qubeArrowDown", id)) { isHiddenDown = true; }
		if (isArrowHidden("qubeArrowLeft", id)) { isHiddenLeft = true; }
		if (isArrowHidden("qubeArrowRight", id)) { isHiddenRight = true; }
		
		// scale SVG arrows (by rendering arrows again)
		this.renderStarSvg();
		
		// reset hidden SVG arrows
		if (isHiddenUp) { hideArrow("qubeArrowUp", id, hCli); }
		if (isHiddenDown) { hideArrow("qubeArrowDown", id, hCli); }
		if (isHiddenLeft) { hideArrow("qubeArrowLeft", id, hCli); }
		if (isHiddenRight) { hideArrow("qubeArrowRight", id, hCli); }
		
		// scale QubeControl size by the same relation
		if (isScalingCubeBySameRelation) {
			// calculate new cube size by new scale relation
			csz = (sizePercent/100) * oldCsz;
			this.qubeControl.resize(csz);
		}

		// calculate top offset and arrow margin offset for the cube centering			
		var boardRowHeight = Number((bS/3).toFixed(2));
		var topMainOffset = -14.6;
		var arrowMarginOffset = (boardRowHeight - csz) / 2;
		var topOffset = arrowMarginOffset + topMainOffset;
		var marginLblPx = 8 - arrowMarginOffset;
		var clickBoardOffset = boardRowHeight - ((csz - boardRowHeight) / 2);
		
		// scale QubeStar board (by updating relevant styles)
		var qStar = document.getElementById(id);
		if (qStar == null) { return; }
		qStar.style.width = bS+"px";
		qStar.style.height = bS+"px";
		var qCI = qSel("#"+id+" .qubeControlInterface");
		qCI.style.top = topOffset+"px";
		var qSC = qSel("#"+id+" .qubeStarCenter");
		qSC.style.width = csz+"px";
		var qSL1 = qSel("#"+id+" .qubeStarLayer1");
		qSL1.style.width = bS+"px";
		qSL1.style.height = bS+"px";
		var qSL2 = qSel("#"+id+" .qubeStarLayer2");
		qSL2.style.width = bS+"px";
		qSL2.style.height = bS+"px";
		var qSR = qSelAll("#"+id+" .qubeStarRow");
		for (i=0; i<3; i++) {
			qSR[i].style.height = boardRowHeight+"px";
		}
		if (!this.isUpLabelCentric) {
			var qSB1 = qSel("#"+id+" .qubeArrowUpWrap");
			qSB1.style.marginBottom = marginLblPx+"px";
		}
		if (!this.isDownLabelCentric) {
			var qSB2 = qSel("#"+id+" .qubeArrowDownWrap");
			qSB2.style.marginTop = marginLblPx+"px";
		}
		// handle clickable arrow overlays
		if (this.hasClickableArrows) {
			var eo = qSel("#" + id + " .qubeStarLayer3");
			if (eo != null) {
				eo.style.width = bS+"px";
				eo.style.height = bS+"px";
				eo.style.top = "-" + clickBoardOffset + "px";
				eo.style.left = "-" + clickBoardOffset + "px";
			}
		}
	};
		
}