var stage;
var myBitmap;
var bottom;
var right;
onload = initialize;
function initialize() {
	canvasObject = document.getElementById('myCanvas');
	var file = "http://jsrun.it/assets/d/O/2/a/dO2at.png";
	var loader = new createjs.PreloadJS(false);
	right = canvasObject.width;
	bottom = canvasObject.height;
	stage = new createjs.Stage(canvasObject);
	loader.onFileLoad = draw;
	loader.loadFile(file);
}
function draw(eventObject) {
	var myImage = eventObject.result;
	var halfWidth = myImage.width / 2;
	var halfHeight = myImage.height / 2;
	right -= halfWidth;
	myBitmap = new createjs.Bitmap(myImage);
	myBitmap.regX = halfWidth;
	myBitmap.regY = halfHeight;
	myBitmap.x = halfWidth;
    myBitmap.y = bottom / 2;
	stage.addChild(myBitmap);
	stage.update();
	setTween(myBitmap, new createjs.Point(right, bottom / 2), 3000, createjs.Ease.bounceOut);
//	createjs.Ticker.addListener(window);
}
function setTween(target, myPoint, time, easing) {
	createjs.Tween.get(target)
	.to({x:myPoint.x, y:myPoint.y}, time, easing);
}
function tick() {
	stage.update();
}