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

	constructor(private globalCollisionGroup: Phaser.Group, public pad: Phaser.SinglePad, public playerNumber: number) {

		pad.deadZone = 0;

		this.sprite = pad.game.add.sprite(startPoses[playerNumber - 1][0], startPoses[playerNumber - 1][1], 'player');
		(<any>this.sprite).player = this;//HACK
		globalCollisionGroup.add(this.sprite);

		this.pad.game.physics.arcade.enable(this.sprite);
		this.body = <Phaser.Physics.Arcade.Body>this.sprite.body;
		this.body.setCircle(playerRadius, 0, 0);
		this.body.collideWorldBounds = true;

		pad.onDownCallback = (inputIndex: number) => {
			//right bumper
			if (inputIndex == 5) {
				const shotAwayDist = 30;

				let shot = this.pad.game.add.sprite(
					this.sprite.x + playerRadius - Globals.ShotRadius + this.pad.axis(2) * shotAwayDist,
					this.sprite.y + playerRadius - Globals.ShotRadius + this.pad.axis(3) * shotAwayDist);

				this.pad.game.physics.arcade.enable(shot);
				let shotBody = <Phaser.Physics.Arcade.Body>shot.body;
				shotBody.setCircle(Globals.ShotRadius);
				shotBody.collideWorldBounds = true;

				shotBody.velocity.set(
					this.pad.axis(2) * Globals.ShotSpeed,
					this.pad.axis(3) * Globals.ShotSpeed
				);
				shotBody.bounce.set(1);
				(<any>shot).shotBy = this; //HACK

				globalCollisionGroup.add(shot);
			}
		}
	}

	update() {
		if (!this.pad.connected) return;

		this.body.velocity.set(this.pad.axis(0) * speed, this.pad.axis(1) * speed)



	}
}