import { Room, Client } from "@colyseus/core";
import { WorldState } from "./schema/worldState";
import { Player } from "./schema/player/player";

export class World extends Room<WorldState> {
	maxClients = 4;
	state = new WorldState();

	onCreate(options: any) {
		this.patchRate = 20;

		this.onMessage("move", (client, data) => {
			const player = this.state.players.get(client.sessionId);

			player.direction = data.x;
			player.direction = data.y;
		});
	}

	onJoin(client: Client, options: any) {
		console.log(client.sessionId, "joined!");
		this.state.players.set(client.sessionId, new Player());
	}

	onLeave(client: Client, consented: boolean) {
		this.state.players.delete(client.sessionId);
		console.log(client.sessionId, "left!");
	}

	onDispose() {
		console.log("room", this.roomId, "disposing...");
	}
}
