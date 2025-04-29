import { Schema, type } from "@colyseus/schema";
import { Vector } from "../utils/vector";

export class Tile extends Schema {
	@type("string") id: string = "";
	@type("string") tileset: string = "terrain"; // Default tileset
	@type(Vector) texturePos: Vector = new Vector();
	@type("boolean") isWalkable: boolean = true;

	constructor(
		id: string = "",
		tileset: string = "terrain",
		texturePos: Vector = new Vector(),
		isWalkable: boolean = true
	) {
		super();
		this.id = id;
		this.tileset = tileset;
		this.texturePos = texturePos;
		this.isWalkable = isWalkable;
	}
}
