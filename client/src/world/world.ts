import { Client, getStateCallbacks, Room } from "colyseus.js";
import { DefaultLoader, Engine, ImageSource, Scene, SceneActivationContext, SpriteSheet, vec } from "excalibur";
import { Chunk } from "./chunk";
import { Player } from "../player/player";

export class World extends Scene {
	public tiles: Map<
		string,
		{
			tileset: string;
			texturePos: {
				x: number;
				y: number;
			};
			walkable?: boolean;
		}
	> = new Map();
	public tilesets: Map<string, SpriteSheet> = new Map();
	public tilesetSrcs: Map<string, ImageSource> = new Map();
	public room: Room = {} as any;
	public state = getStateCallbacks(this.room);
	public chunks: Map<string, Chunk> = new Map();
	public client = new Client({ hostname: "localhost", port: 3000, secure: false });
	public players: Map<string, Player> = new Map();
	public playerSprites = {
		idle: new ImageSource("/character/idle.png"),
		walk: new ImageSource("/character/walk.png"),
	};

	constructor() {
		super();
	}

	async onPreLoad(loader: DefaultLoader): Promise<void> {
		this.tilesetSrcs.set("dirt", new ImageSource("/tileset/dirt.png"));
		this.tilesetSrcs.set("water", new ImageSource("/tileset/water.png"));

		loader.addResource(this.playerSprites.idle);
		loader.addResource(this.playerSprites.walk);
		this.tilesetSrcs.forEach((image) => {
			loader.addResource(image);
		});
	}

	async onActivate(_context: SceneActivationContext<any>): Promise<void> {
		this.room = await this.client.joinOrCreate<any>("world");
		this.state = getStateCallbacks(this.room);

		this.state(this.room.state).listen("tilemap", (_tilemap, pr) => {
			if (pr === undefined) {
				this.room.state.tilemap.chunks.forEach((chunkData: any, key: string) => {
					const chunk = new Chunk(vec(chunkData.x, chunkData.y), chunkData.tiles, this);
					this.add(chunk);
					this.chunks.set(key, chunk);
				});

				this.room.state.tilemap.tileset.forEach((tile: any, id: string) => {
					this.tiles.set(id, tile);
				});

				this.state(this.room.state.tilemap.chunks).onAdd((chunkData: any, key: string) => {
					const chunk = new Chunk(
						vec(
							chunkData.x * this.room.state.tilemap.chunkSize * this.room.state.tilemap.tileSize,
							chunkData.y * this.room.state.tilemap.chunkSize * this.room.state.tilemap.tileSize
						),
						chunkData.tiles,
						this
					);
					this.add(chunk);
					this.chunks.set(key, chunk);
				});

				this.state(this.room.state).players.onAdd((data: any, sesionID: string) => {
					const current = this.room.sessionId == sesionID;
					const player = new Player(data, this, current);
					this.add(player);
					this.players.set(sesionID, player);
					if (current) {
						this.camera.strategy.elasticToActor(player, 0.5, 0.5);
						this.camera.zoom = 3;
					}
				});

				this.state(this.room.state).players.onRemove((_data: any, sessionID: string) => {
					const player = this.players.get(sessionID);
					if (player) {
						this.remove(player);
					}
					this.players.delete(sessionID);
				});
			}
		});
	}

	onInitialize(_engine: Engine): void {
		this.tilesetSrcs.forEach((image, name) => {
			this.tilesets.set(
				name,
				SpriteSheet.fromImageSource({
					image: image,
					grid: { columns: image.width / 16, rows: image.height / 16, spriteHeight: 16, spriteWidth: 16 },
				})
			);
		});
	}
}
