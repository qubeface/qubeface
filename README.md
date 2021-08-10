# QubeFace

## - Create 3D cubes easily -

QubeFace is a JavaScript library that helps to create easily CSS 3D cubes for forms, images or other web content.

Homepage: https://qubeface.github.io

## Features
- flexible creation of 3D cubes in any size and color
- suitable for general website content (forms, pictures, videos, texts, SVG, ...)
- animated spin actions (configurable)
- swipe ability for touch displays and mouse swiping (configurable)
- swipe event handler and swipe stop for temporal swipe prevention
- resize function
- borders (configurable)
- animated explosion effect (configurable)
- auto-disable function for forms (configurable)
- different perspectives (configurable)
- instant displaying function
- initial definition of the cube faces via HTML and JavaScript
- Setter for dynamic content changes
- function to enable permanent vertical or horizontal auto-spinning

## Hints
- QubeFace uses pure JavaScript, so it's completely independent from other libs
- QubeFace uses CSS for the 3D effects 
- tested in Chrome, Firefox, Edge, Opera, Safari and Android-Browser
- no support for Internet Explorer

## Integration
```sh
<script language="javascript" type="text/javascript" src="qubeface.js"></script>
<script language="javascript" type="text/javascript" src="qubestar.js"></script> 
```

## Examples
How to create a cube with QubeFace:
1. create a div container for the position handling and add an inner div container with a HTML id for your cube
2. use a QubeFace object with the same id and define the QubeFace properties
3. call the init method
```
<!-- 1.) QubeFace container -->
<div style="padding-top: 100px;">
	<div id="myQube1"></div>
</div>

<script>
	// 2.) QubeFace definition
	var qube1 = new QubeFace({
		id: "myQube1", 
		sizePx: 200, 
		spinDurationSeconds: 0.7,
		backgroundColor: "rgba(0, 206, 209, 0.85)",
		front:  '<div onclick="qube1.spinToRight();">FRONT</div>',
		back:   '<div onclick="qube1.spinToLeft();">BACK</div>',
		top:    '<div onclick="qube1.spinToBack();">TOP</div>',
		bottom: '<div onclick="qube1.spinToTop();">BOTTOM</div>',
		right:  '<div onclick="qube1.spinToBottom();">RIGHT</div>',
		left:   '<div onclick="qube1.spinToFront();">LEFT</div>'
	});
	
	// 3.) QubeFace initialization
	qube1.init();
</script>	
```

It's also possible to use HTML container instead of pure JavaScript. This can be important to handle with EventListeners. See example:
```
<!-- 1.) QubeFace container with HTML faces containers -->
<div style="padding-top: 100px;">
	<div id="myQube2">
	<div class="qube-face qube-front">FRONT</div>
	<div class="qube-face qube-back">BACK</div>
	<div class="qube-face qube-top">TOP</div>
	<div class="qube-face qube-bottom">BOTTOM</div>
	<div class="qube-face qube-left">LEFT</div>
	<div class="qube-face qube-right">RIGHT</div>
	</div>
</div>

<script>
	// 2.) QubeFace definition
	var qube2 = new QubeFace({
		id: "myQube2", 
		sizePx: 200, 
		spinDurationSeconds: 0.7,
		backgroundColor: "rgba(185, 227, 250, 0.85)",
		borderWidth: 3
	});
	
	// 3.) QubeFace initialization
	qube2.init();
	
	// enable swipe touch and swipe mouse events
	qube2.enableSwipe();
</script>
```
QubeStar and QubeControl provide a more user friendly swipe and spin gesture. QubeControl can handle items like a web wizard and QubeStar sets the four direction arrows around the cube. See example:
```
<div style="position:relative;top:10px;">
	<div id="myQubeStar1"></div>
</div>

<script>
	// QubeControl with QubeItem's
	var qube1 = new QubeControl({
		id: "myQubeStar1", 
		sizePx: 70, 
		spinDurationSeconds: 0.4, 
		backgroundColor: "rgba(32, 178, 170, 0.5)", 
		endElementContent: '✓', // put here a strinv value or a HTML string as content
		perspectivePx: 600,
		items:[
			{itemId:1, value:"a1", content: "Con1"},
			{itemId:2, value:"a2", content: "Con2"}, 
			{itemId:3, value:"a3", content: '<svg width="20" height="20"><circle cx="10" cy="10" r="5" stroke="green" stroke-width="4" fill="yellow"/></svg>'}, 
			{itemId:4, value:"a4", content: "Con4", ifUpThenIndex:0, ifDownThenIndex:0, ifRightThenIndex:0, ifLeftThenIndex:0}
		]
	});
	var qubeStar1 = new QubeStar({
		qubeControl: qube1,
		arrowColor: "#B0E0E6",
		arrowFocusColor: "rgba(144, 238, 144, 0.5)",
		upLabel: "up",
		downLabel: "down",
		leftLabel: "left",
		rightLabel: "right",
		hasClickableArrows:false, 
		isPagingMode: false
	});
</script>
```
With the property `boardSizePx` you can change the board size of the board which is around the QubeStar. 
You can also calibrate the arrow rectangle and his width, height, size and translate distance with the QubeStar properties `arrowWidthPercent`, `arrowHeightPercent` and `arrowTranslate`.

## License

MIT

