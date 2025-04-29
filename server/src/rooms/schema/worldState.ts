import { MapSchema, Schema, type } from "@colyseus/schema";
import { Player } from "./player/player";
import { Tilemap } from "./tilemap/tilemap";

export class WorldState extends Schema {
	@type({ map: Player }) players = new MapSchema<Player>(new Map());
	@type(Tilemap) tilemap = new Tilemap();
}
