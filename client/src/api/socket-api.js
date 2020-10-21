const socket = new WebSocket("ws://localhost:8800");

export let connectionId;

export const sendDataToServer = (data) => {
  if (socket.readyState === 1) {
    socket.send(JSON.stringify(data));
  }
};

export const useReceivedData = (handleShape, handleUndoRedo, allShapes) => {
  socket.onmessage = (event) => {
    const parsed = JSON.parse(event.data);
    switch (parsed.type) {
      case "id":
        connectionId = parsed.id;
        break;
      case "getShapes":
        const shapesToServer = { type: "receiveShapes", shapes: allShapes };
        socket.send(JSON.stringify(shapesToServer));
        break;
      case "shape":
        handleShape(parsed.shape);
        break;
      case "receiveShapes":
        //if shapes is empty then folowing operation will not be excecuted
        for (const shape of parsed.shapes) {
          handleShape(shape);
        }
        break;
      case "Undo":
      case "Redo":
        handleUndoRedo(parsed);
        break;
    }
  };
};

//First idea on how to implement data transfer from callback to dispatch
// export const dispatchReceivedData = (handleShape) => {
//   const promise = new Promise((resolve) => {
//     useEffect(() => {
//       socket.onmessage = (event) => {
//         resolve(JSON.parse(event.data));
//       };
//     }, []);
//   });
//   promise.then((value) => {
//     handleShape(value);
//   });
// };
