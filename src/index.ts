import 'pixi';
import 'p2';
import * as Phaser from 'phaser';
import './css/reset.css';

import GameState from './gameState';
import LoadingState from './loadingState';

new GameState();
new LoadingState();
declare function require(filename: string): any;

class SimpleGame {
	game: Phaser.Game;
	logo: Phaser.Sprite;
	cursors: Phaser.CursorKeys;

	constructor() {
		this.game = new Phaser.Game(1280, 720, Phaser.AUTO, "content");
		this.game.state.add('loading', LoadingState);
		this.game.state.add('game', GameState);
		this.game.state.start('game');
	}
}

const game = new SimpleGame();
