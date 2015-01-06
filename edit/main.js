var game = new Phaser.Game(1, 1, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('start',   '../sprites/start.png');
	game.load.image('exit',   '../sprites/exit.png');
	game.load.image('black',   '../sprites/black.png');
}

var player;
var exit;
var walls;

var level;

var newLvl;
var newLvlStr;

var pressed = 0;

var startX;
var startY;

var endX;
var endY;

var pKey;

var test;

var wallCheck;
var tempX;
var tempY;

var newPathname;

window.onhashchange = loadLevel;

function create() {
	player = game.add.sprite(0, 0, 'start');

	game.scale.setGameSize(16*player.width, 8*player.height);
	game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
	game.stage.backgroundColor = '#FFFFFF';

	pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);

	exit = game.add.sprite(15*player.width, 7*player.height, 'exit');
	walls = game.add.group();

	game.input.addPointer();
	game.input.addPointer();
	game.input.onDown.add(beginSwipe);
	game.input.onUp.add(endSwipe);

	if (location.hash == '') {
		saveLevel();
	}

	loadLevel();
}

function update() {
	if (pKey.isDown) {
		testLevel();
	}
}

function loadLevel() {
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
		walls.create(w[0]*player.width, w[1]*player.height, 'black');
	});
	game.physics.enable(walls, Phaser.Physics.ARCADE);
}

function beginSwipe() {
	pressed++;
	if (pressed == 4) {test = 1;}
	startX = parseInt(game.input.worldX/player.width)*player.width;
	startY = parseInt(game.input.worldY/player.height)*player.height;
}

function endSwipe() {
	pressed--;
	if (pressed > 0) {return;}
	if (test == 1) {
		test = 0;
		pKey.isDown = 1;
		return;
	}
	wallCheck = 0;
	endX = parseInt(game.input.worldX/player.width)*player.width;
	endY = parseInt(game.input.worldY/player.height)*player.height;

	if (endX == player.x && endY == player.y) {
		if (startX == exit.x && startY == exit.y) {
			tempX = player.x;
			tempY = player.y;
			player.x = exit.x;
			player.y = exit.y;
			exit.x = tempX;
			exit.y = tempY;
		}
		saveLevel();
		return;
	}
	if (endX == exit.x && endY == exit.y) {
		if (startX == player.x && startY == player.y) {
			tempX = player.x;
			tempY = player.y;
			player.x = exit.x;
			player.y = exit.y;
			exit.x = tempX;
			exit.y = tempY;
		}
		saveLevel();
		return;
	}
	if (game.physics.arcade.getObjectsAtLocation(endX, endY, walls).length) {
		wallCheck = 1;
		game.physics.arcade.getObjectsAtLocation(endX, endY, walls).forEach(function(w) {
			walls.remove(w);
		});
	}
	if (startX == player.x && startY == player.y) {
		player.x = endX;
		player.y = endY;
	}
	else if (startX == exit.x && startY == exit.y) {
		exit.x = endX;
		exit.y = endY;
	}
	else if (game.physics.arcade.getObjectsAtLocation(startX, startY, walls).length) {
		game.physics.arcade.getObjectsAtLocation(startX, startY, walls).forEach(function(w) {
			walls.remove(w);
		});
		walls.create(endX, endY, 'black');
	}
	else if (!wallCheck) {
		walls.create(endX, endY, 'black');
	}
	game.physics.enable(walls, Phaser.Physics.ARCADE);
	saveLevel();
}

function saveLevel() {
	newLvl = {
		start: [player.x/player.width, player.y/player.height],
		exit: [exit.x/player.width, exit.y/player.height],
		next: 'editor',
		walls: []
	};
	walls.children.forEach(function(w) {
		newLvl.walls.push([w.x/player.width, w.y/player.height]);
	});
	newLvlStr = JSON.stringify(newLvl);

	location.hash = encodeURIComponent(newLvlStr);
}

function testLevel() {
	newPathname = location.pathname.substring(0, location.pathname.length - 1);
	newPathname = newPathname.substring(0, newPathname.lastIndexOf('/') + 1);
	location.pathname = newPathname;
}