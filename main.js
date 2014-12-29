var game = new Phaser.Game(1, 1, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('pushee', 'sprites/pushee.png');
	game.load.image('wall',   'sprites/wall.png');
	game.load.image('exit',   'sprites/exit.png');
	game.load.image('used',   'sprites/used.png');
	game.load.json('level1',   'levels/1.json');
	game.load.json('level2',   'levels/2.json');
	game.load.json('level3',   'levels/3.json');
}

var player;
var newX;
var newY;

var walls;

var upKey;
var downKey;
var leftKey;
var rightKey;

var keyIsDown;

var rKey;

var l = 0;

var levelOrder =
[
'level1',
'level2',
'level3'
];

function create() {
	player = game.add.sprite(0, 0, 'pushee');
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

	walls = game.add.group();
	exit = game.add.sprite(15*player.width, 7*player.height, 'exit');

	loadLevel(l);

game.input.onDown.add(beginSwipe, this);
}

function update() {
	newX = player.x;
	newY = player.y;
	if (upKey.isDown && !keyIsDown)
	{
		newY = player.y - player.height;
		keyIsDown = true;
	}
	else if (downKey.isDown && !keyIsDown)
	{
		newY = player.y + player.height;
		keyIsDown = true;
	}
	else if (leftKey.isDown && !keyIsDown)
	{
		newX = player.x - player.width;
		keyIsDown = true;
	}
	else if (rightKey.isDown && !keyIsDown)
	{
		newX = player.x + player.width;
		keyIsDown = true;
	}
	if (!upKey.isDown && !downKey.isDown && !leftKey.isDown && !rightKey.isDown) {
		keyIsDown = false;
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
			walls.create(player.x, player.y, 'used');
			game.physics.enable(walls, Phaser.Physics.ARCADE);
			player.x = newX;
			player.y = newY;
			if (player.x==level.exit[0]*player.width && player.y==level.exit[1]*player.height) {
				if (walls.length>=127) {l++;}
				if (l>=levelOrder.length) {l=0;}
				loadLevel(l);
			}
		}
	}
	if (rKey.isDown) {
		loadLevel(l);
	}
	leftKey.isDown=0;
	rightKey.isDown=0;
	upKey.isDown=0;
	downKey.isDown=0;
}

function loadLevel (l) {
	level = game.cache.getJSON(levelOrder[l]);
	walls.destroy();
	walls = game.add.group();
	player.x = level.start[0]*player.width;
	player.y = level.start[1]*player.height;
	level.walls.forEach(function(w) {
		walls.create(w[0]*player.width, w[1]*player.height, 'wall');
	});
	game.physics.enable(walls, Phaser.Physics.ARCADE);
	exit.x = level.exit[0]*player.width;
	exit.y = level.exit[1]*player.height
}

function beginSwipe() {
	startX = game.input.worldX;
	startY = game.input.worldY;
	game.input.onDown.remove(beginSwipe);
	game.input.onUp.add(endSwipe);
}

function endSwipe() {
	endX = game.input.worldX;
	endY = game.input.worldY;
	var distX = startX-endX;
	var distY = startY-endY;
	if(Math.abs(distX)>Math.abs(distY)*2 && Math.abs(distX)>10) {
		if(distX>0) {
			leftKey.isDown=1;
		}
		else {
			rightKey.isDown=1;
		}
	}
	if(Math.abs(distY)>Math.abs(distX)*2 && Math.abs(distY)>10) {
		if(distY>0) {
			upKey.isDown=1;
		}
		else {
			downKey.isDown=1;
		}
	}
	game.input.onDown.add(beginSwipe);
	game.input.onUp.remove(endSwipe);
}