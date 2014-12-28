var game = new Phaser.Game(1, 1, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('pushee', 'sprites/pushee.png');
	game.load.image('wall',   'sprites/wall.png');
	game.load.image('exit',   'sprites/exit.png');
	game.load.image('used',   'sprites/used.png');
}

var player;
var keyIsDown;

var upKey;
var downKey;
var leftKey;
var rightKey;

var walls;

function create() {
	walls = game.add.group();
	player = game.add.sprite(50, 50, 'pushee');

	var newX = player.x;
	var newY = player.y;

	walls.create(50*6, 50*7, 'wall');

	game.scale.setGameSize(player.width*16, player.height*8);

	game.stage.backgroundColor = '#FFFFFF';

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.enable(walls, Phaser.Physics.ARCADE);
	game.physics.enable(player, Phaser.Physics.ARCADE);

	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
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
		}
	}
}