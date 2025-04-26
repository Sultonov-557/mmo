import { Schema, type, view } from "@colyseus/schema";
import { Vector } from "./vector";

export class Player extends Schema {
	@type({ type: Vector }) position: Vector;
	@type({ type: Vector }) velocity: Vector;
	@type({ type: Vector }) direction: Vector;
}
