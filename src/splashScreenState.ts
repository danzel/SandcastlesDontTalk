import * as Globals from './globals';

export default class LoadingState extends Phaser.State {
	init() {
	}

	padsText: Phaser.Text;
	startToPlay: Phaser.Text;

	create() {
		let text = this.add.text(this.world.centerX, 100, 'I am the splash screen', { font: '16px Arial', fill: '#dddddd', align: 'center' });
		text.anchor.setTo(0.5, 0.5);

		this.padsText = this.add.text(this.world.centerX, this.world.height - 200, 'TODO', { font: '50px ' + Globals.FontName, fill: '#dddddd', align: 'center' });
		this.padsText.anchor.setTo(0.5, 0.5);

		this.startToPlay = this.add.text(this.world.centerX, this.world.height - 100, 'Press Start to Play', { font: '50px ' + Globals.FontName, fill: '#dddddd', align: 'center' });
		this.startToPlay.anchor.setTo(0.5, 0.5);
	}

	update() {
		this.padsText.text = this.input.gamepad.padsConnected + ' Pads Connected';

		this.startToPlay.visible = (this.input.gamepad.padsConnected >= 2);


		if (this.startToPlay.visible) {
			if (this.input.gamepad.pad1.isDown(9) || this.input.gamepad.pad2.isDown(9) || this.input.gamepad.pad3.isDown(9) || this.input.gamepad.pad4.isDown(9)) {
				this.state.start('game');
			}
		}
	}
}
