import * as Globals from './globals';


const startPoses = [
	[100, 100],
	[Globals.ScreenWidth - 100, 100],
	[Globals.ScreenWidth - 100, Globals.ScreenHeight - 100],
	[100, Globals.ScreenHeight - 100]
]

const playerRadius = 20;
const speed = 300;

export class Player {

	sprite: Phaser.Sprite;
	body: Phaser.Physics.Arcade.Body;
	shotGroup: Phaser.Group;

	constructor(private globalCollisionGroup: Phaser.Group, public pad: Phaser.SinglePad, public playerNumber: number) {

		pad.deadZone = 0.2;

		this.sprite = pad.game.add.sprite(startPoses[playerNumber - 1][0], startPoses[playerNumber - 1][1], 'player');
		globalCollisionGroup.add(this.sprite);

		this.pad.game.physics.arcade.enable(this.sprite);
		this.body = <Phaser.Physics.Arcade.Body>this.sprite.body;
		this.body.setCircle(playerRadius, 0, 0);
		this.body.collideWorldBounds = true;

		this.shotGroup = this.pad.game.add.physicsGroup(Phaser.Physics.ARCADE);

		this.body.checkCollision.any = true;

		pad.onDownCallback = (inputIndex: number) => {
			//right bumper
			if (inputIndex == 5) {
				const shotAwayDist = 30;
				const shotRadius = 5;

				const shotSpeed = 500;

				console.log(this.pad.axis(2))
				let shot = this.pad.game.add.sprite(
					this.sprite.x + playerRadius - shotRadius + this.pad.axis(2) * shotAwayDist,
					this.sprite.y + playerRadius - shotRadius + this.pad.axis(3) * shotAwayDist);
				//+ this.body.velocity.y / speedDivider
				this.pad.game.physics.arcade.enable(shot);
				let shotBody = <Phaser.Physics.Arcade.Body>shot.body;
				shotBody.setCircle(shotRadius);

				shotBody.velocity.set(
					this.pad.axis(2) * shotSpeed,// + this.body.velocity.x,
					this.pad.axis(3) * shotSpeed// + this.body.velocity.y
				);

				globalCollisionGroup.add(shot);
				//this.shotGroup.add(shot)
			}
		}
	}

	update() {
		if (!this.pad.connected) return;

		this.body.velocity.set(this.pad.axis(0) * speed, this.pad.axis(1) * speed)



	}
}