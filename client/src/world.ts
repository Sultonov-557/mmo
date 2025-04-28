import { DefaultLoader, Engine, ImageSource, Scene, SpriteSheet, TileMap, vec } from "excalibur";

export class World extends Scene {
	public tilemap: TileMap;
	public tileset?: SpriteSheet;
	public tilesetSrc: ImageSource = new ImageSource("/tinyBlocks.png");
	constructor() {
		super();
		this.tilemap = new TileMap({ tileHeight: 16, tileWidth: 16, columns: 16, rows: 16 });
		this.tilemap.scale = vec(5, 5);
	}

	async onPreLoad(loader: DefaultLoader): Promise<void> {
		loader.addResource(this.tilesetSrc);
	}

	onInitialize(_engine: Engine): void {
		this.add(this.tilemap);

		this.tileset = SpriteSheet.fromImageSource({
			image: this.tilesetSrc,
			grid: { columns: 12, rows: 12, spriteHeight: 16, spriteWidth: 16 },
		});
		this.tilemap.tiles.forEach((tile, index) => {
			if (this.tileset) {
				console.log(index);
				tile.addGraphic(this.tileset.sprites[0]);
			}
		});
	}
}
