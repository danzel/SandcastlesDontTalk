import * as Globals from './globals';
import { PowerUp } from './powerUp';

const startPoses = [
	[100, 100],
	[Globals.ScreenWidth - 100, 100],
	[Globals.ScreenWidth - 100, Globals.ScreenHeight - 100],
	[100, Globals.ScreenHeight - 100]
]

const bulletHellStartPoses = [
	[Globals.ScreenWidth / 2 - 100, Globals.ScreenHeight / 2 - 100],
	[Globals.ScreenWidth / 2 + 100, Globals.ScreenHeight / 2 - 100],
	[Globals.ScreenWidth / 2 + 100, Globals.ScreenHeight / 2 + 100],
	[Globals.ScreenWidth / 2 - 100, Globals.ScreenHeight / 2 + 100],
]

const colors = [
	'#ff0000',
	'#00ff00',
	'#0000ff',
	'#ffffff'
];


export class Player {

	color: any;
	sprite: Phaser.Sprite;
	body: Phaser.Physics.Arcade.Body;

	lastShot: number;

	powerUp: PowerUp;

	isDead = false;

	shootSound: Phaser.Sound;

	constructor(private globalCollisionGroup: Phaser.Group, public pad: Phaser.SinglePad, public playerNumber: number, powerUp: PowerUp) {
		this.lastShot = this.pad.game.time.totalElapsedSeconds();

		this.powerUp = powerUp;

		pad.deadZone = 0;

		this.shootSound = pad.game.add.audio('shoot');

		let startPos = ((powerUp == PowerUp.RealBulletHell) ? bulletHellStartPoses : startPoses);
		this.sprite = pad.game.add.sprite(startPos[playerNumber - 1][0], startPos[playerNumber - 1][1], '1px');
		(<any>this.sprite).player = this;//HACK
		globalCollisionGroup.add(this.sprite);

		this.pad.game.physics.arcade.enable(this.sprite);
		this.body = <Phaser.Physics.Arcade.Body>this.sprite.body;
		this.body.setCircle(Globals.PlayerRadius, 0, 0);
		this.body.collideWorldBounds = true;
		this.color = colors[playerNumber - 1]; //hack

		pad.onDownCallback = (inputIndex: number) => {
			//right bumper
			if (inputIndex == 5) {
			}

			if (inputIndex == 9) { //start
				this.pad.game.state.start('game');
			}
		}

		let circle = this.pad.game.add.graphics(0, 0);
		this.sprite.addChild(circle);

		circle.lineStyle(1, this.color, 0.5);
		circle.beginFill(0xffffff, 0.3);
		circle.drawCircle(0, 0, Globals.SlowDownRange * 2);

		//let texture = this.pad.game.add.sprite(0, 0, 'player');
		//texture.anchor.set(0.5);
		//texture.scale.set(0.3);
		//this.sprite.addChild(texture);
	}

	update() {
		if (!this.pad.connected || this.isDead) return;

		let speed = Globals.PlayerSpeed;
		if (this.powerUp == PowerUp.Speedy)
			speed *= 1.6;
		this.body.velocity.set(this.pad.axis(0) * speed, this.pad.axis(1) * speed)

		let timeSinceLast = this.pad.game.time.totalElapsedSeconds() - this.lastShot;
		var thing = new Phaser.Point(this.pad.axis(2), this.pad.axis(3));
		let length = thing.distance(new Phaser.Point(0, 0));
		thing.normalize();

		let timeBetweenShots = 0.5;
		if (this.powerUp == PowerUp.MachineGun) {
			timeBetweenShots = 0.2;

			//thing = thing.rotate(0, 0, 20 * Math.random() - 10, true);
		}
		if (this.powerUp == PowerUp.SpreadShot) {
			timeBetweenShots *= 2;
		}

		if (this.powerUp != PowerUp.RealBulletHell && timeSinceLast > timeBetweenShots && length > 0.7) {
			this.lastShot = this.pad.game.time.totalElapsedSeconds();

			let spreadAmount = 10;

			this.shootSound.play();

			this.fireShot(thing);
			if (this.powerUp == PowerUp.SpreadShot) {
				thing = thing.rotate(0, 0, spreadAmount, true);
				this.fireShot(thing);
				thing = thing.rotate(0, 0, -2 * spreadAmount, true);
				this.fireShot(thing);
				thing = thing.rotate(0, 0, 3 * spreadAmount, true);
				this.fireShot(thing);
				thing = thing.rotate(0, 0, -4 * spreadAmount, true);
				this.fireShot(thing);
			}
		}
	}

	fireShot(thing: Phaser.Point) {
		let shot = this.pad.game.add.sprite(
			this.sprite.x + Globals.PlayerRadius - Globals.ShotRadius + thing.x * (Globals.PlayerRadius + Globals.ShotAwayDist),
			this.sprite.y + Globals.PlayerRadius - Globals.ShotRadius + thing.y * (Globals.PlayerRadius + Globals.ShotAwayDist));

		this.pad.game.physics.arcade.enable(shot);
		let shotBody = <Phaser.Physics.Arcade.Body>shot.body;
		shotBody.setCircle(Globals.ShotRadius);
		shotBody.collideWorldBounds = true;

		let shotSpeed = Globals.ShotSpeed;
		if (this.powerUp == PowerUp.Speedy) {
			shotSpeed *= 2;
		}
		shotBody.velocity.set(
			thing.x * shotSpeed,
			thing.y * shotSpeed
		);
		shotBody.bounce.set(1);
		(<any>shot).shotBy = this; //HACK
		(<any>shot).color = this.color;//hack
		(<any>shot).isInInitialSlowArea = true;//hack

		this.globalCollisionGroup.add(shot);

	}
}