import { createServer } from "http";
import { Server, Socket as ioSocket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../../shared/socket";
import { localConfig } from "../config/local";
import { onConnection } from "./socket/init";

// Define our own Socket type for simplicity.
export type ClientSocket = ioSocket<ClientToServerEvents, ServerToClientEvents>;
export type ServerSocket = Server<ClientToServerEvents, ServerToClientEvents>;

// Create the HTTP server.
const httpServer = createServer();

// Initial Socket IO server with the shared types.
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: localConfig.corsOrigin,
    methods: localConfig.methods,
  },
});

httpServer.listen(localConfig.port, localConfig.host, () => {
  // TODO See if we have to listen to the post using the HTTP server.
  console.log(`Listening on port ${localConfig.port}`);
});

onConnection(io);
