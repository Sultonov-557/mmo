import { Engine, TileMap, Vector } from "excalibur";
import { World } from "./world";

export class Chunk extends TileMap {
	constructor(pos: Vector, public tilesData: any[], public world: World) {
		super({ columns: 16, rows: 16, tileHeight: 16, tileWidth: 16, pos });
	}

	onInitialize(_engine: Engine): void {
		this.tiles.forEach((tile, index) => {
			const tileData = this.world.tiles.get(this.tilesData[index]);

			if (!tileData) return;

			const graphic = this.world.tilesets
				.get(tileData.tileset)
				?.getSprite(tileData.texturePos.x, tileData.texturePos.y);

			tile.solid = !tileData.walkable || true;
			if (!graphic) return;
			tile.addGraphic(graphic);
		});
	}
}
