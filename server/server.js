const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8800 });

const clients = new Set();
const queue = new Set();
let id = 0;

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: "id", id: id }));
  id++;
  if (clients.size > 1) {
    queue.add(ws);
    const clientToRequestFrom = [...clients][0];
    clientToRequestFrom.send(JSON.stringify({ type: "getShapes" }));
  }

  ws.on("message", (message) => {
    const parsedMessage = JSON.parse(message);
    switch (parsedMessage.type) {
      case "receiveShapes":
        if (parsedMessage.shapes.length > 0 && queue.size > 0) {
          shapes = parsedMessage.shapes;
          const wsReceiver = [...queue][0];
          queue.delete(wsReceiver);
          wsReceiver.send(JSON.stringify({ type: "receiveShapes", shapes }));
        }
        break;
      case "shape":
        for (const client of clients) {
          if (ws !== client) {
            client.send(message);
          }
        }
        break;
      case "Undo":
      case "Redo": {
        for (const client of clients) {
          if (ws !== client) {
            client.send(message);
          }
        }
        break;
      }
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    queue.delete(ws);
    if (clients.size === 0) {
      shapes = [];
      id = 0;
    }
  });
});
