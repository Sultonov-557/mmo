import { Schema, type, view } from "@colyseus/schema";
import { Vector } from "./vector";

export class Player extends Schema {
	@type(Vector) position: Vector = new Vector();
	@type(Vector) direction: Vector = new Vector();

	@type("number") speed: number = 200;
}
