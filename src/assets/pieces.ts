import * as Globals from '../globals';

declare function require(url: string): string;

const imageFileNames = [
	require('./images/pieces/1.png'),
	require('./images/pieces/2.png'),
	require('./images/pieces/3.png'),
	require('./images/pieces/backwardsr.png'),
	require('./images/pieces/I.png'),
	require('./images/pieces/J.png'),
	require('./images/pieces/L.png'),
	require('./images/pieces/O.png'),
	require('./images/pieces/r.png'),
	require('./images/pieces/S.png'),
	require('./images/pieces/T.png'),
	require('./images/pieces/Z.png'),
];

const pixelBits = [
	[
		'#'
	],
	[
		'#',
		'#'
	],
	[
		'#',
		'#',
		'#'
	],
	[
		'##',
		' #'
	],
	[
		'#',
		'#',
		'#',
		'#'
	],
	[
		' #',
		' #',
		'##'
	],
	[
		'# ',
		'# ',
		'##'
	],
	[
		'##',
		'##'
	],
	[
		'##',
		'# '
	],
	[
		' ##',
		'## '
	],
	[
		'###',
		' # '
	],
	[
		'## ',
		' ##'
	]
];

export class PieceDef {
	bits: boolean[][];

	constructor(public filename: string, bitsString: string[]) {
		this.bits = [];
		for (let y = 0; y < bitsString.length; y++) {
			let arr = [];
			this.bits.push(arr);
			for (let x = 0; x < bitsString[y].length; x++) {
				arr.push(bitsString[y][x] == '#');
			}
		}
	}

	addPhysics(p2: Phaser.Physics.P2, sprite: Phaser.Sprite): void {
		p2.enable(sprite, Globals.DebugRender);
		let body = <Phaser.Physics.P2.Body>sprite.body;
		body.clearShapes();
		for (let y = 0; y < this.bits.length; y++) {
			let line = this.bits[y];
			for (let x = 0; x < line.length; x++) {
				if (line[x]) {
					let rect = body.addRectangle(Globals.GridPx, Globals.GridPx, x * Globals.GridPx, y * Globals.GridPx);
					//rect.
				}
			}
		}
		body.adjustCenterOfMass();

		body.angularDamping = 0.8;
	}
}

if (imageFileNames.length != pixelBits.length) {
	throw new Error("you fucked up");
}

export function PieceMaker(res: PieceDef[], load: Phaser.Loader): void {
	for (let i = 0; i < imageFileNames.length; i++) {
		load.image('sprite_' + i, imageFileNames[i])
		res.push(new PieceDef('sprite_' + i, pixelBits[i]));
	}
}
