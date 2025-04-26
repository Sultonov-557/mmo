import { Color, Engine, vec } from "excalibur";
import { Client, getStateCallbacks } from "colyseus.js";
import { Player } from "./player";
import { World } from "./world";

const client = new Client({ hostname: "localhost", port: 3000, secure: false });
const game = new Engine({
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: Color.fromHex("#131313"),
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

const world = await client.joinOrCreate<any>("world");

const $ = getStateCallbacks(world);

$(world.state).players.onAdd((data, sesionID) => {
	const current = world.sessionId == sesionID;
	const player = new Player(vec(data.x, data.y), current ? world : undefined);
	players.set(sesionID, player);
	game.add(player);

	if (!current) {
		$(data).onChange(() => {
			player.pos = vec(data.x, data.y);
		});
	}
});

$(world.state).players.onRemove((_data, sessionID) => {
	const player = players.get(sessionID);
	if (player) {
		game.remove(player);
	}
	players.delete(sessionID);
});
