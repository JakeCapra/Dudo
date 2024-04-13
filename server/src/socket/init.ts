import { ClientSocket, ServerSocket } from "../index";
import { registerHandlers } from "./handlers";

// TODO don't make this global
export let io: ServerSocket;

export const onConnection = (server: ServerSocket) => {
  io = server;

  server.on("connection", (socket: ClientSocket) => {
    // TODO reference this SO post for how to better organize the socket handlers:
    // https://stackoverflow.com/questions/20466129/how-to-organize-socket-handling-in-node-js-and-socket-io-app
    // Set up the handlers for incoming socket events.
    registerHandlers(socket);
  });
};
