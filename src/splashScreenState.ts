import * as Globals from './globals';

export default class LoadingState extends Phaser.State {
	init() {
	}

	padsText: Phaser.Text;
	startToPlay: Phaser.Text;

	create() {

		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.restitution = 1;
		this.physics.p2.friction = 0;
		this.physics.p2.setImpactEvents(true);

		this.add.sprite(0, 0, 'SplashScreen');


		for (let i = 0; i < 200; i++) {
			let shot = this.game.add.sprite(Math.random() * Globals.ScreenWidth, Math.random() * Globals.ScreenHeight, 'shot_' + Math.floor(Math.random() * 5));
			shot.blendMode = PIXI.blendModes.ADD;
			shot.scale.set(3 * Globals.ShotRadius / 136);

			this.game.physics.p2.enable(shot);
			let shotBody = <Phaser.Physics.P2.Body>shot.body;
			shotBody.setCircle(Globals.ShotRadius);
			shotBody.collideWorldBounds = true;
			shotBody.moveRight((Math.random() * 2 - 1) * Globals.ShotSpeed);
			shotBody.moveDown((Math.random() * 2 - 1) * Globals.ShotSpeed);
			shotBody.damping = 0;

			shotBody.angle = Math.random() * 360;
		}

		this.add.sprite(0, 0, 'Title');

		this.padsText = this.add.text(this.world.centerX, this.world.height - 300, 'TODO', { font: '50px ' + Globals.FontName, fill: '#dddddd', align: 'center' });
		this.padsText.anchor.setTo(0.5, 0.5);

		this.startToPlay = this.add.text(this.world.centerX, this.world.height - 200, 'Press Start to Play', { font: '50px ' + Globals.FontName, fill: '#dddddd', align: 'center' });
		this.startToPlay.anchor.setTo(0.5, 0.5);
	}

	update() {
		this.padsText.text = this.input.gamepad.padsConnected + ' Pads Connected';

		if (!this.input.gamepad.enabled || !this.input.gamepad.active) {
			this.padsText.text += '. Press a button to enable maybe'
		}
		this.startToPlay.visible = (this.input.gamepad.padsConnected >= 2);


		if (this.startToPlay.visible) {
			if (this.input.gamepad.pad1.isDown(9) || this.input.gamepad.pad2.isDown(9) || this.input.gamepad.pad3.isDown(9) || this.input.gamepad.pad4.isDown(9)) {
				this.state.start('game');
			}
		}
	}
}
