import { Color, Engine } from "excalibur";
import { Client, getStateCallbacks } from "colyseus.js";
import { Player } from "./player";
import { World } from "./world";
const client = new Client({ hostname: "localhost", port: 3000, secure: false });
const game = new Engine({
	width: window.innerWidth,
	height: window.innerHeight,
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

const players: Map<string, Player> = new Map();

game.start();
game.goToScene("world");

const room = await client.joinOrCreate<any>("world");

const $ = getStateCallbacks(room);

$(room.state).players.onAdd((data, sesionID) => {
	const current = room.sessionId == sesionID;

	const player = new Player(data, $, current ? room : undefined);
	game.add(player);
	players.set(sesionID, player);
});

$(room.state).players.onRemove((_data, sessionID) => {
	const player = players.get(sessionID);
	if (player) {
		game.remove(player);
	}
	players.delete(sessionID);
});
