import config, { getTransport } from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";

import { World } from "./rooms/world";

export default config({
	initializeGameServer: (gameServer) => {
		gameServer.define("world", World);
	},

	initializeExpress: (app) => {
		app.use("/", playground());

		app.use("/monitor", monitor());
	},

	beforeListen: () => {},
});
