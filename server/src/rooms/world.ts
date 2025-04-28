import { Room, Client } from "@colyseus/core";
import { WorldState } from "./schema/worldState";
import { Player } from "./schema/player/player";
import { Vector } from "./schema/player/vector";

export class World extends Room<WorldState> {
	state = new WorldState();

	onCreate(options: any) {
		this.onMessage("move", (client, data) => {
			const player = this.state.players.get(client.sessionId);

			player.direction.x = data.x;
			player.direction.y = data.y;
		});
		this.setSimulationInterval((delta) => this.update(delta));
	}

	update(delta: number) {
		if (!this) return;
		const players = this.state.players;
		players.forEach((player) => {
			if (player.direction.x != 0 || player.direction.y != 0) {
				player.position.x += player.direction.x * player.speed * (delta / 1000);
				player.position.y += player.direction.y * player.speed * (delta / 1000);
			}
		});
	}

	onJoin(client: Client, options: any) {
		console.log(client.sessionId, "joined!");
		const player = new Player();
		player.position = new Vector(500, 500);
		this.state.players.set(client.sessionId, player);
	}

	onLeave(client: Client, consented: boolean) {
		if (this.state.players.has(client.sessionId)) {
			this.state.players.delete(client.sessionId);
		}
		console.log(client.sessionId, "left!");
	}

	onDispose() {
		console.log("room", this.roomId, "disposing...");
	}
}
