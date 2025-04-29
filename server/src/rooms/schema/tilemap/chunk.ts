import { Schema, type } from "@colyseus/schema";
import { perlin } from "./noise";

export class Chunk extends Schema {
	@type("number") x: number = 0;
	@type("number") y: number = 0;
	@type("number") width: number = 16; // Default chunk size
	@type("number") height: number = 16;
	@type(["string"]) tiles: string[] = new Array(16 * 16).fill("dirt");

	constructor(chunkX: number = 0, chunkY: number = 0) {
		super();
		this.x = chunkX;
		this.y = chunkY;

		this.tiles.forEach((_tile, index) => {
			const y = Math.floor(+index / this.width);
			const x = +index % this.width;

			const height = perlin(chunkX * this.width + x, chunkY * this.height + y);

			if (height < 0.5) {
				this.tiles[index] = "water";
			}
		});
	}
}
