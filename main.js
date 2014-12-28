var game = new Phaser.Game(1, 1, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('pushee', 'sprites/pushee.png');
	game.load.image('wall',   'sprites/wall.png');
	game.load.image('exit',   'sprites/exit.png');
	game.load.image('used',   'sprites/used.png');
	game.load.json('level1',   'levels/1.json');
	game.load.json('level2',   'levels/2.json');
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

	var level1 = game.cache.getJSON('level1');

	player = game.add.sprite(0, 0, 'pushee');
	player.x = level1.start[0]*player.width;
	player.y = level1.start[1]*player.height;

	var newX = player.x;
	var newY = player.y;

	game.scale.setGameSize(player.width*16, player.height*8);

	game.stage.backgroundColor = '#FFFFFF';

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.enable(player, Phaser.Physics.ARCADE);

	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

	level1.walls.forEach(function(w){
		walls.create(w[0]*player.width, w[1]*player.height, 'wall');
	});
	exit = game.add.sprite(level1.exit[0]*player.width, level1.exit[1]*player.width, 'exit');
	game.physics.enable(walls, Phaser.Physics.ARCADE);
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
		if (walls.length==127) {

		var level2 = game.cache.getJSON('level2');

		level2.walls.forEach(function(w){
			walls.create(w[0]*player.width, w[1]*player.height, 'wall');
		});
		exit = game.add.sprite(level2.exit[0]*player.width, level2.exit[1]*player.width, 'exit');
		game.physics.enable(walls, Phaser.Physics.ARCADE);

		}
	}
}