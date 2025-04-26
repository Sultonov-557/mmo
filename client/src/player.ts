import { Room } from "colyseus.js";
import { Actor, Color, Engine, Keys, Vector } from "excalibur";

export class Player extends Actor {
	private speed: number = 200; // pixels per second
	private isControlled: boolean;

	constructor(pos: Vector, public world?: Room) {
		const isControlled = !!world;
		super({ height: 20, width: 20, color: isControlled ? Color.Green : Color.Red, pos });
		this.isControlled = isControlled;

		if (this.isControlled && world) {
			setInterval(() => {
				world.send("move", { x: this.pos.x, y: this.pos.y });
			}, 50);
		}
	}

	onPostUpdate(engine: Engine, elapsed: number): void {
		if (this.isControlled) {
			const keys = engine.input.keyboard.getKeys();
			const moveVector = new Vector(0, 0);

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

			// Normalize for diagonal movement
			if (moveVector.size > 0) {
				moveVector.normalize();
				// Apply speed and elapsed time for frame-rate independent movement
				this.pos.x += moveVector.x * this.speed * (elapsed / 1000);
				this.pos.y += moveVector.y * this.speed * (elapsed / 1000);
			}
		}
	}
}
