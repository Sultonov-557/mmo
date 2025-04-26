import { MapSchema, Schema, type } from "@colyseus/schema";
import { Player } from "./player/player";

export class WorldState extends Schema {
	@type({ map: Player }) players = new MapSchema<Player>();
}
