# QubeFace

## - Create 3D cubes easily -

QubeFace is a JavaScript library that helps to create easily CSS 3D cubes for forms, images or other web content.

## Features
- flexible creation of 3D cubes in size and color
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

## Example
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


## License

MIT

