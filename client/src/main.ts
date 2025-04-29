import { Color, Engine } from "excalibur";
import { World } from "./world/world";


const game = new Engine({
	resolution: { height: window.innerHeight, width: window.innerWidth },
	backgroundColor: Color.fromHex("#131313"),
	fixedUpdateFps: 60,
	pixelArt: true,
	scenes: { world: World },
});

window.onresize = () => {
	game.screen.resolution = {
		width: window.innerWidth,
		height: window.innerHeight,
	};
	game.screen.viewport = { width: window.innerWidth, height: window.innerHeight };
};

await game.start();
await game.goToScene("world");

