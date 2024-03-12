import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../../shared/socket";
import { Socket, initializeHandlers } from "../src";

//Source: https://socket.io/docs/v4/testing/

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe("socket", () => {
  let io: Server,
    serverSocket: Socket,
    clientSocket: ClientSocket<ServerToClientEvents, ClientToServerEvents>;

  beforeEach((done) => {
    const httpServer = createServer();
    io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);

      initializeHandlers(io);
    });
  });

  afterEach(() => {
    io.close();
    clientSocket.disconnect();
  });

  test("create room", (done) => {
    clientSocket.emit("createRoom", "name", (resp) => {
      expect(resp.Error).toBeUndefined();
      done();
    });
  });

  //   test("should work with an acknowledgement", (done) => {
  //     serverSocket.on("hi", (cb) => {
  //       cb("hola");
  //     });
  //     clientSocket.emit("hi", (arg) => {
  //       expect(arg).toBe("hola");
  //       done();
  //     });
  //   });

  //   test("should work with emitWithAck()", async () => {
  //     serverSocket.on("foo", (cb) => {
  //       cb("bar");
  //     });
  //     const result = await clientSocket.emitWithAck("foo");
  //     expect(result).toBe("bar");
  //   });

  //   test("should work with waitFor()", () => {
  //     clientSocket.emit("baz");

  //     return waitFor(serverSocket, "baz");
  //   });
});
