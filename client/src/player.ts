import { Room } from "colyseus.js";
import { Actor, Color, Engine, Keys, vec, Vector } from "excalibur";

export class Player extends Actor {
	private speed: number = 200; // pixels per second
	private isControlled: boolean;
	public moveDir: Vector = vec(0, 0);
	private goto?: Vector;

	constructor(data: any, public state?: any, public room?: Room) {
		const isControlled = !!room;
		super({ height: 20, width: 20, color: isControlled ? Color.Green : Color.Red, pos: data.pos, z: 1 });
		this.isControlled = isControlled;
		this.speed = data.speed;
		this.state(data.position).onChange(() => {
			if (isControlled) {
				if (data.position.x != this.pos.x && data.position.y != this.pos.y) {
					this.pos = vec(data.position.x, data.position.y).average(this.pos);
				}
			} else {
				this.goto = vec(data.position.x, data.position.y);
			}
		});

		if (isControlled) {
			setInterval(() => {
				room.send("move", { x: this.moveDir.x, y: this.moveDir.y });
			}, 16);
		}
	}

	onPostUpdate(engine: Engine, elapsed: number): void {
		if (this.isControlled) {
			const keys = engine.input.keyboard.getKeys();
			let moveVector = new Vector(0, 0);

			// Calculate movement direction
			if (keys.includes(Keys.KeyW) || keys.includes(Keys.ArrowUp)) {
				moveVector.y -= 1;
			}
			if (keys.includes(Keys.KeyS) || keys.includes(Keys.ArrowDown)) {
				moveVector.y += 1;
			}
			if (keys.includes(Keys.KeyA) || keys.includes(Keys.ArrowLeft)) {
				moveVector.x -= 1;
			}
			if (keys.includes(Keys.KeyD) || keys.includes(Keys.ArrowRight)) {
				moveVector.x += 1;
			}
			moveVector = moveVector.normalize();

			moveVector.x = Math.round(moveVector.x * 10) / 10;
			moveVector.y = Math.round(moveVector.y * 10) / 10;

			this.moveDir = moveVector.clone();

			// Normalize for diagonal movement
			if (moveVector.size > 0) {
				this.pos.x += moveVector.x * this.speed * (elapsed / 1000);
				this.pos.y += moveVector.y * this.speed * (elapsed / 1000);
			}
		} else {
			if (this.goto) {
				this.pos.x += ((this.goto.x - this.pos.x) * 20 * elapsed) / 1000;
				this.pos.y += ((this.goto.y - this.pos.y) * 20 * elapsed) / 1000;
			}
		}
	}
}
