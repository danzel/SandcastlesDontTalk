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
	0xff0000,
	0x00ff00,
	0x0000ff,
	0xffffff
];


export class Player {

	color: any;
	sprite: Phaser.Sprite;
	realSprite: Phaser.Sprite;
	body: Phaser.Physics.P2.Body;

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
		globalCollisionGroup.add(this.sprite);

		this.pad.game.physics.p2.enable(this.sprite, Globals.DebugRender);
		this.body = <Phaser.Physics.P2.Body>this.sprite.body;
		(<any>this.body.data).player = this;//HACK
		this.body.clearShapes();
		this.body.addCircle(Globals.PlayerRadius);
		//this.body.setCircle(Globals.PlayerRadius, 0, 0);
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

		//circle.lineStyle(1, this.color, 0.5);
		circle.beginFill(0xffffff, 0.3);
		circle.drawCircle(0, 0, Globals.SlowDownRange * 2);

		//circle.beginFill(0, 1);
		//circle.beginFill(this.color, 1);
		//circle.drawCircle(0, 0, Globals.PlayerRadius * 2);

		this.realSprite = this.pad.game.add.sprite(0, 0, 'player_' + playerNumber);
		this.realSprite.anchor.set(0.5, 0.59);
		this.realSprite.scale.set(0.2);
		this.sprite.addChild(this.realSprite);
		
	}

	update() {
		if (!this.pad.connected || this.isDead) return;

		let speed = Globals.PlayerSpeed;
		if (this.powerUp == PowerUp.Speedy)
			speed *= 1.6;
		this.body.setZeroVelocity();
		this.body.moveRight(this.pad.axis(0) * speed);
		this.body.moveDown(this.pad.axis(1) * speed);

		this.realSprite.angle = new Phaser.Point(this.body.velocity.x, this.body.velocity.y).angle(new Phaser.Point(0, 0), true) - 90;
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
		let x = this.sprite.x + Globals.PlayerRadius - Globals.ShotRadius + thing.x * (Globals.PlayerRadius + Globals.ShotAwayDist);
		let y = this.sprite.y + Globals.PlayerRadius - Globals.ShotRadius + thing.y * (Globals.PlayerRadius + Globals.ShotAwayDist);
		let shot = this.pad.game.add.sprite(x, y, 'shot_' + this.playerNumber);
		shot.scale.set(3 * Globals.ShotRadius / 136);
		//shot.beginFill(this.color, 0.7);
		//shot.drawCircle(0, 0, Globals.ShotRadius * 2);

		this.pad.game.physics.p2.enable(shot);
		let shotBody = <Phaser.Physics.P2.Body>shot.body;
		shotBody.setCircle(Globals.ShotRadius);
		shotBody.angle = Math.random() * 360;
		shotBody.collideWorldBounds = true;

		let shotSpeed = Globals.ShotSpeed;
		if (this.powerUp == PowerUp.Speedy) {
			shotSpeed *= 2;
		}
		shotBody.moveRight(thing.x * shotSpeed);
		shotBody.moveDown(thing.y * shotSpeed);
		shotBody.damping = 0;
		//TODO shotBody.bounce.set(1);
		(<any>shotBody.data).sprite = shot;
		(<any>shotBody.data).shotBy = this;
		(<any>shotBody.data).color = this.color;
		(<any>shot).isInInitialSlowArea = true;

		this.globalCollisionGroup.add(shot);

	}
}