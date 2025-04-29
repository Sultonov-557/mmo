import { Schema, type } from "@colyseus/schema";
import { Chunk } from "./chunk";
import { Tile } from "./tile";
import tiles from "./tiles.json";
import { Vector } from "../utils/vector";

export class Tilemap extends Schema {
	@type("number") chunkSize: number = 16;
	@type("number") tileSize: number = 16;
	@type({ map: Chunk }) chunks = new Map<string, Chunk>();
	@type({ map: Tile }) tileset = new Map<string, Tile>();

	constructor() {
		super();
		for (let id in tiles) {
			const tile = (tiles as any)[id];
			this.tileset.set(
				id,
				new Tile(id, tile.tileset, new Vector(tile.texturePos.x, tile.texturePos.y), tile.walkable || true)
			);
		}
	}

	getChunk(x: number, y: number): Chunk {
		const key = `${x},${y}`;
		if (!this.chunks.has(key)) {
			this.chunks.set(key, new Chunk(x, y));
		}
		return this.chunks.get(key)!;
	}

	getTile(worldX: number, worldY: number): Tile {
		const chunkX = Math.floor(worldX / this.chunkSize / this.tileSize);
		const chunkY = Math.floor(worldY / this.chunkSize / this.tileSize);
		const localX = worldX % this.chunkSize;
		const localY = worldY % this.chunkSize;

		const chunk = this.getChunk(chunkX, chunkY);
		return this.tileset.get(chunk.tiles[localY * chunk.width + localX]);
	}

	setTile(worldX: number, worldY: number, tile: string): void {
		const chunkX = Math.floor(worldX / this.chunkSize);
		const chunkY = Math.floor(worldY / this.chunkSize);
		const localX = worldX % this.chunkSize;
		const localY = worldY % this.chunkSize;

		const chunk = this.getChunk(chunkX, chunkY);
		chunk.tiles[localY * chunk.width + localX] = tile;
	}
}
