import * as Phaser from 'phaser';
import * as WebFont from 'webfontloader';
import * as Globals from './globals';

declare function require(url: string): string;

export default class LoadingState extends Phaser.State {
	init() {
	}

	preload() {
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		WebFont.load({
			google: {
				families: [Globals.FontName]
			},
			active: () => this.create()
		})

		let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts and sweet sweet graphics', { font: '16px Arial', fill: '#dddddd', align: 'center' });
		text.anchor.setTo(0.5, 0.5);

		this.load.image('1px', require('./assets/images/1px.png'));

		this.load.image('particle_1', require('./assets/images/particles/1.png'));


		this.load.image('player_1', require('./assets/images/space/RedSpaceship.png'));
		this.load.image('player_2', require('./assets/images/space/GreenSpaceship.png'));
		this.load.image('player_3', require('./assets/images/space/BlueSpaceship.png'));
		this.load.image('player_4', require('./assets/images/space/YellowSpaceship.png'));

		this.load.image('shot_1', require('./assets/images/shots/RedAmmo.png'));
		this.load.image('shot_2', require('./assets/images/shots/GreenAmmo.png'));
		this.load.image('shot_3', require('./assets/images/shots/BlueAmmo.png'));
		this.load.image('shot_4', require('./assets/images/shots/YellowAmmo.png'));
		this.load.image('shot_0', require('./assets/images/shots/Shrapnel.png'));

		this.load.image('bg', require('./assets/images/Background.png'));
		this.load.image('walls', require('./assets/images/Walls.png'));

		this.load.audio('shoot', require('./assets/sounds/shoot.m4a'));
		this.load.audio('explode', require('./assets/sounds/explode.m4a'));
		this.game.sound.setDecodedCallback(['shoot', 'explode'], () => { }, this);

		this.input.gamepad.start();

	}

	loaded = 0;
	create() {
		this.loaded++;
		if (this.loaded == 2){
			//this.state.start('game');
			this.state.start('splashscreen');
		}
	}
}