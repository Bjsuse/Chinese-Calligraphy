
/* I have implemented this directly from takawo's tutorial:
  Title: 230418a
  Author: takawo
  Date: n.d. 
  https://openprocessing.org/sketch/1899893/embed/
*/

//I have importing the radicals of Chinese characters//
let radicals = [
  "⺀", "⺁", "⺂", "⺃", "⺄", // 偏旁部首
  "⼀", "⼁", "⼂", "⼃", "⼄", "⺅", "⺆", "⺇", "⺈", "⺉","⺊", "⺋", "⺌", "⺍", "⺎",  "⺨", "⺩", "⺪", "⺫", "⺬", "⺲", "⺳", "⺴", "⺵", "⺶",  "⺷", "⺸", "⺹", "⺺", "⺻", "⺼", "⺽", "⺾", "⺿", "⻀", "⻐", "⻑", "⻒", "⻓", "⻔", "⻤", "⻥", "⻦", "⻧", "⻨","⻟", "⻠", "⻡", "⻢", "⻣","⻮", "⻯", "⻰", "⻱", "⻲", "⺭", "⺮", "⺯", "⺰", "⺱", "⺣", "⺤", "⺥", "⺦", "⺧",
];
let graphics;
let palette;
let offset;

let rs;
let g;
let w;

function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 360, 100, 100, 100);
	angleMode(DEGREES);
	chars = createCharArray(65393, 44);
	noStroke();
	noSmooth();
	rs = int(random(1000000));

	offset = -width / 15;
	
}

function draw() {
	w = sqrt(sq(max(width, height)) * 2) + offset;
	let t = (frameCount / 240) % 4;
	let n = t % 1;
	n = easeInOutCirc(n);
	let m = int(t);


  
	randomSeed(rs);
	blendMode(BLEND);
	background(0, 0, 90);
	recursiveRect(offset, offset, width - offset * 2, height - offset * 2, 3);
}

function recursiveRect(x, y, w, h, depth) {
	if (depth < 0) return;
	let rsx = random(10000);
	let rsy = random(10000);
	let t =
		((x + w / 2 - offset + (y - offset + h / 2) * (width - offset * 2)) /
			((width - offset * 2) * (height - offset * 2)) +
			(frameCount % 1000) / 1000) %
		1;
	t = easeInOutCirc(sin(t * 360) / 2 + 0.5);
	// t = easeInOutCirc(t);
	let nw = (sin(rsx + y / 20 + t * 360) / 2.5 / 1.5 + 0.5) * w;
	let nh = (cos(rsy + x / 20 + t * 360) / 3 / 1.5 + 0.5) * h;

	if (depth == 0) {
		drawRect(x, y, nw, nh, t, calcDim(w, h, nw, nh));
		drawRect(x + nw, y, w - nw, nh, t, calcDim(w, h, w - nw, nh));
		drawRect(x, y + nh, nw, h - nh, t, calcDim(w, h, nw, h - nh));
		drawRect(x + nw, y + nh, w - nw, h - nh, t, calcDim(w, h, w - nw, h - nh));
	} else {
		recursiveRect(x, y, nw, nh, depth - 1);
		recursiveRect(x + nw, y, w - nw, nh, depth - 1);
		recursiveRect(x, y + nh, nw, h - nh, depth - 1);
		recursiveRect(x + nw, y + nh, w - nw, h - nh, depth - 1);
	}
}

function calcDim(a, b, c, d) {
	return (c * d) / (a * b);
}

function drawRect(x, y, w, h, t, ratio) {
	let v = (ratio * 2) % 1;
	v = easeInOutCirc(v);
	v = constrain(v, 0.2, 0.8);
	let angle = (int(random(4)) * 360) / 4;
	push();
	translate(x + w / 2, y + h / 2);
	
	if (angle % 180 == 90) {
		let tmp = w;
		w = h;
		h = tmp;
	}
	imageMode(CENTER);
	rectMode(CENTER);
	rotate(angle);

	let num = int(map(ratio, 0, 1, chars.length - 1, 0));
	textAlign(CENTER, CENTER);
	textSize(max(1, min(w, h) - 5));
	fill(0, 0, 0);

	text(radicals[num], 0, 0);
	 strokeCap(SQUARE);
	
	pop();
	
}



function easeInOutCirc(x) {
	return x < 0.5 ?
		(1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2 :
		(Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
}

function easeInOutElastic(x) {
	const c5 = (2 * Math.PI) / 4.5;
	return x === 0 ?
		0 :
		x === 1 ?
		1 :
		x < 0.5 ?
		-(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2 :
		(Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function createCharArray(f, num) {
	let array = [];
	for (let i = 0; i < num; i++) {
		let str = String.fromCodePoint(f + i);
		
		array.push(str);
	}
	array.push("　");
	let g = createGraphics(10, 10);
	g.textSize(g.width);
	g.textAlign(CENTER, CENTER);
	for (let i = 0; i < array.length; i++) {
		let str = array[i];
		g.clear();
		g.fill(255);
		g.text(str, g.width / 2, g.height / 2);
		g.loadPixels();
		let num = 0;
		for (let j = 0; j < g.pixels.length; j += 4) {
			let c = g.pixels[j];
			if (c > 0) num++;
		}
		array[i] = {
			str: str,
			num: num,
		};
	}
	g.remove();
	array.sort(function(a, b) {
		return a.num - b.num;
	});
	for (let obj of array) {
		delete obj.num
	}
	return array;
}






//I have added the ability to click to the next page//
function mouseClicked() {
 if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    window.location.href = "https://editor.p5js.org/Bjsuse/full/kyMWaJ8bL";
  }
}




function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function createCharArray(f, num) {
	let array = [];
	for (let i = 0; i < num; i++) {
		let str = String.fromCodePoint(f + i);
		String.fromCodePoint(0x12000 + int(random(618)));
		array.push(str);
	}
	array.push("　");
	let g = createGraphics(10, 10);
	g.textSize(g.width);
	g.textAlign(CENTER, CENTER);
	for (let i = 0; i < array.length; i++) {
		let str = array[i];
		g.clear();
		g.fill(255);
		g.text(str, g.width / 2, g.height / 2);
		g.loadPixels();
		let num = 0;
		for (let j = 0; j < g.pixels.length; j += 4) {
			let c = g.pixels[j];
			if (c > 0) num++;
		}
		array[i] = {
			str: str,
			num: num,
		};
	}
	g.remove();
	array.sort(function(a, b) {
		return a.num - b.num;
	});
	for (let obj of array) {
		delete obj.num
	}
	return array;
}
