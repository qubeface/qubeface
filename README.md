# QubeFace

## - Create easy 3D cubes -

QubeFace is a JavaScript library that helps to create easy CSS 3D cubes for forms, images or other web content.

## Features
- easy and flexible creation of 3D cubes
- suitable for general website content (forms, pictures, videos, texts, SVG, ...)
- animated spin actions (configurable)
- it's possible to enable permanent vertical or horizontal auto-spinning
- swipe ability for touch display and mouse (configurable)
- swipe stop for temporal swipe prevention
- swipe event handler
- cubes can be created in any size
- it's possible to resize created cubes
- configurable colors
- it's possible to use the auto-disable function for forms
- animated explosion effect (configurable)
- it's possible to use border
- different changes of perspective are possible
- instant display of a cube face is possible 
- much more settings and methods
- initial definition of the cube faces via HTML and JavaScript is possible
- Setter methods for dynamic content changes


## Hints
- QubeFace uses pure JavaScript, so it's completely independent from other libs
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

