import { DefaultLoader, Scene } from "excalibur";
import { TilesetResource } from "@excaliburjs/plugin-tiled";

export class World extends Scene {
	constructor() {
		super();
	}

	async onPreLoad(loader: DefaultLoader): Promise<void> {
		const res = new TilesetResource("/terrain.xml", 1,{});

		loader.addResource(res);
		loader.onAfterLoad = async () => {
			console.log(res);
		};
	}
}
