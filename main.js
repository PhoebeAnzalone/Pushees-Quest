var game = new Phaser.Game(1, 1, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function randInt(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

function preload() {
	game.load.image('blue', 'sprites/blue.png');
	game.load.image('red', 'sprites/red.png');
	game.load.image('lightgray', 'sprites/lightgray.png');
	game.load.image('darkgray', 'sprites/darkgray.png');
	game.load.image('black', 'sprites/black.png');
	game.load.image('white', 'sprites/white.png');
	game.load.image('pSprite', 'sprites/P.png');
	game.load.image('xSprite', 'sprites/X.png');
	game.load.image('asteriskSprite', 'sprites/asterisk.png');
	game.load.image('oSprite', 'sprites/O.png');
	game.load.json('level1',   'levels/1.json');
	game.load.json('level2',   'levels/2.json');
	game.load.json('level3',   'levels/3.json');
	game.load.json('level4',   'levels/4.json');
	game.load.json('level5',   'levels/5.json');
	game.load.json('level6',   'levels/6.json');
	game.load.json('level7',   'levels/7.json');
	game.load.json('level8',   'levels/8.json');
	game.load.json('level9',   'levels/9.json');
}

var classic = 0;

var player;
var exit;
var walls;

var level;

var newLvlStr;

var path;

var pathCollision = 0;

var pathX;
var pathY;

var newPathX;
var newPathY;

var pressed = 0;
var pressedMax = 0;
var pressedTotal = 0;

var startX;
var startY;

var endX;
var endY;

var newX;
var newY;

var trailColors =
[
'lightgray',
'darkgray'
];

var currentColor = 0;

var upKey;
var downKey;
var leftKey;
var rightKey;

var keyIsDown;

var rKey;
var pKey;

var restart;
var edit;

function create() {
	if (!classic) {
		player = game.add.sprite(0, 0, 'blue');
	}
	else {
		player = game.add.sprite(0, 0, 'pSprite');
	}

	newX = player.x;
	newY = player.y;

	game.scale.setGameSize(16*player.width, 8*player.height);
	game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
	game.stage.backgroundColor = '#FFFFFF';

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.enable(player, Phaser.Physics.ARCADE);

	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

	rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
	pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);

	if (!classic) {
		exit = game.add.sprite(15*player.width, 7*player.height, 'red');
	}
	else {
		exit = game.add.sprite(15*player.width, 7*player.height, 'xSprite');
	}
	walls = game.add.group();

	game.input.addPointer();
	game.input.addPointer();
	game.input.onDown.add(beginSwipe);
	game.input.onUp.add(endSwipe);

	if (location.hash == '#random') {
		createRandomLevel();
	}

	level = game.cache.getJSON('level1');
	newLvlStr = JSON.stringify(level);

	if (location.hash == '') {
		location.hash = encodeURIComponent(newLvlStr);
	}

	loadLevel();
}

function update() {
	newX = player.x;
	newY = player.y;
	if (upKey.isDown && !keyIsDown)
	{
		newY = player.y - player.height;
		keyIsDown = 1;
	}
	else if (downKey.isDown && !keyIsDown)
	{
		newY = player.y + player.height;
		keyIsDown = 1;
	}
	else if (leftKey.isDown && !keyIsDown)
	{
		newX = player.x - player.width;
		keyIsDown = 1;
	}
	else if (rightKey.isDown && !keyIsDown)
	{
		newX = player.x + player.width;
		keyIsDown = 1;
	}
	if (!upKey.isDown && !downKey.isDown && !leftKey.isDown && !rightKey.isDown) {
		keyIsDown = 0;
	}
	if (newY < 0)
	{
		newY = game.height-player.height;
	}
	if (newY > game.height-player.height)
	{
		newY = 0;
	}
	if (newX < 0)
	{
		newX = game.width-player.width;
	}
	if (newX > game.width-player.width)
	{
		newX = 0;
	}
	if (!game.physics.arcade.getObjectsAtLocation(newX, newY, walls).length) {
		if (newX != player.x || newY != player.y) {
			if (!classic) {
				walls.create(player.x, player.y, trailColors[currentColor]);
			}
			else {
				walls.create(player.x, player.y, 'asteriskSprite');
			}
			currentColor++;
			if (currentColor >= trailColors.length) {currentColor = 0;}
			game.physics.enable(walls, Phaser.Physics.ARCADE);
			player.x = newX;
			player.y = newY;
			if (player.x == exit.x && player.y == exit.y) {
				if (walls.length >= 127) {
					if (level.next == 'editor') {
						editLevel();
					}
					else if (level.next == 'random') {
						createRandomLevel();
					}
					else {
					level = game.cache.getJSON(level.next);
					newLvlStr = JSON.stringify(level);
					location.hash = encodeURIComponent(newLvlStr);
					}
				}
				loadLevel();
			}
		}
	}
	if (rKey.isDown) {
		loadLevel();
	}
	if (pKey.isDown) {
		editLevel();
	}
	releaseControls();
}

function releaseControls() {
	leftKey.isDown = 0;
	rightKey.isDown = 0;
	upKey.isDown = 0;
	downKey.isDown = 0;
	keyIsDown = 0;
	rKey.isDown = 0;
	pKey.isDown = 0;
}

function loadLevel() {
	currentColor = 0;
	walls.destroy();
	walls = game.add.group();
	player.x = 0;
	player.y = 0;
	exit.x = 15*player.width;
	exit.y = 7*player.height;

	level = location.hash.substring(1);
	if (level == '') {return;}
	level = decodeURIComponent(level);
	level = JSON.parse(level);

	player.x = level.start[0]*player.width;
	player.y = level.start[1]*player.height;
	exit.x = level.exit[0]*player.width;
	exit.y = level.exit[1]*player.height;
	level.walls.forEach(function(w) {
		if (!classic) {
			walls.create(w[0]*player.width, w[1]*player.height, 'black');
		}
		else {
			walls.create(w[0]*player.width, w[1]*player.height, 'oSprite');
		}
	});
	game.physics.enable(walls, Phaser.Physics.ARCADE);
}

function beginSwipe() {
	pressed++;
	pressedTotal++;
	startX = game.input.worldX;
	startY = game.input.worldY;
	if (pressed >= pressedMax) {pressedMax = pressed;}
	if (pressedMax == 3) {restart = 1;}
	if (pressedMax == 4) {restart = 0; edit = 1;}
}

function endSwipe() {
	pressed--;
	if (pressed > 0) {return;}
	pressedMax = 0;
	pressedTotal = 0;
	if (restart == 1) {
		restart = 0;
		rKey.isDown = 1;
		return;
	}
	if (edit == 1) {
		edit = 0;
		pKey.isDown = 1;
		return;
	}
	endX = game.input.worldX;
	endY = game.input.worldY;
	var distX = startX-endX;
	var distY = startY-endY;
	if(Math.abs(distX) > Math.abs(distY)*2 && Math.abs(distX) > 10) {
		if(distX > 0) {
			leftKey.isDown = 1;
		}
		else {
			rightKey.isDown = 1;
		}
	}
	if(Math.abs(distY) > Math.abs(distX)*2 && Math.abs(distY) > 10) {
		if(distY > 0) {
			upKey.isDown = 1;
		}
		else {
			downKey.isDown = 1;
		}
	}
}

function editLevel() {
	location.pathname += 'edit/';
}

function createRandomLevel() {
	level = {
		start: [],
		exit: [],
		next: 'random',
		walls: []
	};
	pathX = randInt(0,15);
	pathY = randInt(0,7);
	for (i = 0; i < 255; i++) {
		newPathX = pathX;
		newPathY = pathY;
		switch(randInt(0,3)) {
			default:
			case 0:
			newPathX++;
			break;

			case 1:
			newPathX--;
			break;

			case 2:
			newPathY++;
			break;

			case 3:
			newPathY--;
			break;
		}
		if (newPathX > 15) {newPathX = 0;}
		if (newPathX < 0) {newPathX = 15;}
		if (newPathY > 7) {newPathY = 0;}
		if (newPathY < 0) {newPathY = 7;}
		level.walls.forEach(function(w) {
			if (newPathX == w[0] && newPathY == w[1]) {pathCollision = 1;}
		});
		if (!pathCollision) {
			pathX = newPathX;
			pathY = newPathY;
			level.walls.push([pathX, pathY]);
		}
		pathCollision = 0;
	}
	path = level.walls;
	level.start = level.walls[0];
	level.exit = level.walls[level.walls.length - 1];
	level.walls = [];
	for (j = 0; j <= 15; j++) {
		for (s = 0; s <= 7; s++) {
			path.forEach(function(w) {
				if (j == w[0] && s == w[1]) {pathCollision = 1;}
			});
			if (!pathCollision) {
				level.walls.push([j, s]);
			}
			pathCollision = 0;
		}
	}
	newLvlStr = JSON.stringify(level);
	location.hash = encodeURIComponent(newLvlStr);
}