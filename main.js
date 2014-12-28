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
	player = game.add.sprite(0, 0, 'pushee');
	walls.create(50*4, 50*3, 'wall');

	game.scale.setGameSize(player.width*16, player.height*8);

	game.stage.backgroundColor = '#FFFFFF';

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.enable(walls, Phaser.Physics.ARCADE);
	game.physics.enable(player, Phaser.Physics.ARCADE);


	//  In this example we'll create 4 specific keys (up, down, left, right) and monitor them in our update function

	upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
	downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
	leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
}

function update() {
	if (upKey.isDown && !keyIsDown)
	{
		player.y -= player.height;
		keyIsDown = true;
	}
	else if (downKey.isDown && !keyIsDown)
	{
		player.y += player.height;
		keyIsDown = true;
	}
	else if (leftKey.isDown && !keyIsDown)
	{
		player.x -= player.width;
		keyIsDown = true;
	}
	else if (rightKey.isDown && !keyIsDown)
	{
		player.x += player.width;
		keyIsDown = true;
	}
	if (!upKey.isDown && !downKey.isDown && !leftKey.isDown && !rightKey.isDown) {
		keyIsDown = false;
	}

	game.physics.arcade.getObjectsAtLocation(200, 150, walls, function(foo, bar){
		// console.log(foo, bar);
	});

/*	if(game.physics.arcade.overlap(player, walls)) {
		player.x = 200;
		player.y = 200;
	}*/
}