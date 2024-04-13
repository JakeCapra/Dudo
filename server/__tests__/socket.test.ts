import { createServer, Server as httpServerT } from "http";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../../shared/socket";
import { onConnection } from "../src/socket/init";

let clientSocket: ClientSocket<ServerToClientEvents, ClientToServerEvents>;
let httpServer: httpServerT;
let httpServerAddr: any;
let ioServer: Server<ClientToServerEvents, ServerToClientEvents>;

beforeAll((done) => {
  httpServer = createServer();
  httpServerAddr = httpServer.listen().address();
  ioServer = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer);
  onConnection(ioServer);
  done();
});

afterAll((done) => {
  ioServer.close();
  httpServer.close();
  done();
});

beforeEach((done) => {
  clientSocket = ioc(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
    transports: ["websocket"],
  });
  clientSocket.on("connect", () => {
    done();
  });
});

afterEach((done) => {
  if (clientSocket.connected) {
    clientSocket.disconnect();
  }
  done();
});

describe("create room", () => {
  test("ok", () => {
    // Listen to players. When we createRoom, players should be emitted.
    clientSocket.on("players", (players) => {
      expect(players).toBe([{ playerName: "name", diceCount: 5 }]);
    });

    clientSocket.emit("createRoom", "name", (resp) => {
      expect(resp.Error).toBe("any"); // TODO this should fail
      //   expect(resp.Error).toBeUndefined();
      expect(resp.RoomCode).toBeDefined();
    });
  });
});

// describe("join room", () => {
//   test("ok", () => {
//     clientSocket.on("players", (players) => {
//       expect(players).toBe([
//         { playerName: "user1", diceCount: 5 },
//         { playerName: "user2", diceCount: 5 },
//       ]);
//     });

//     clientSocket.emit("joinRoom", "user2", "not a room", (resp) => {
//       expect(resp.Error).toBeUndefined();
//     });
//   });
// });
