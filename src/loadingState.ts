import * as Phaser from 'phaser';
import * as WebFont from 'webfontloader';
import * as Globals from './globals';
import { PowerUp } from './powerUp';

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
		this.load.image('crown', require('./assets/images/Crown.png'));

		this.load.image('SplashScreen', require('./assets/images/SplashScreen.png'));
		this.load.image('Title', require('./assets/images/Title.png'));
		

		this.load.audio('shoot', require('./assets/sounds/shoot.m4a'));
		this.load.audio('explode', require('./assets/sounds/explode.m4a'));
		//Needed?
		/*this.game.sound.setDecodedCallback([
			'shoot', 'explode'
		], () => { }, this);*/

		this.load.audio(PowerUp[PowerUp.BulletsSlowDown], require('./assets/sounds/announcer/announcer-bulletsslowdown.m4a'));
		this.load.audio(PowerUp[PowerUp.MachineGun], require('./assets/sounds/announcer/announcer-machinegun.m4a'));
		this.load.audio(PowerUp[PowerUp.RealBulletHell], require('./assets/sounds/announcer/announcer-realbullethell.m4a'));
		this.load.audio(PowerUp[PowerUp.Speedy], require('./assets/sounds/announcer/announcer-speedy.m4a'));
		this.load.audio(PowerUp[PowerUp.SpreadShot], require('./assets/sounds/announcer/announcer-spreadshot.m4a'));
		this.load.audio(PowerUp[PowerUp.SuperHot], require('./assets/sounds/announcer/announcer-superhot.m4a'));
		this.load.audio(PowerUp[PowerUp.SuperHotSpreadShot], require('./assets/sounds/announcer/announcer-superhotspreadshot.m4a'));
		this.load.audio(PowerUp[PowerUp.Walls], require('./assets/sounds/announcer/announcer-walls.m4a'));

		this.load.audio('draw', require('./assets/sounds/announcer/draw.m4a'));
		this.load.audio('win_1', require('./assets/sounds/announcer/player1win.m4a'));
		this.load.audio('win_2', require('./assets/sounds/announcer/player2win.m4a'));
		this.load.audio('win_3', require('./assets/sounds/announcer/player3win.m4a'));
		this.load.audio('win_4', require('./assets/sounds/announcer/player4win.m4a'));

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