import { addShape } from "../store/shapes";

export let connectionId;

export const socket = new WebSocket("ws://localhost:8800");

export const sendDataToServer = (data) => {
  if (socket.readyState === 1) {
    socket.send(JSON.stringify(data));
  }
};

export const middleware = store => next => {
    socket.onmessage = (event) => {
      const parsedEvent = JSON.parse(event.data);
      const type = parsedEvent.type; 
      const payload = parsedEvent.payload;
      switch (type) {
        case "Add_shape":
        case "Undo":
        case "Redo":    
          store.dispatch(parsedEvent);
          break;
        case "id":
          connectionId = payload;
          break;
        case "getShapes":
          console.log("UWU")
          //console.log(store.getState);
          const allShapes = store.getState().history.past;
          const shapesToServer = { type: "receiveShapes", payload: allShapes };
          socket.send(JSON.stringify(shapesToServer));
          break;
        case "receiveShapes":
          //if shapes is empty then folowing operation will not be excecuted
          for (const shape of payload) {
            store.dispatch({ type: "Add_shape", ...shape });
            //store.dispatch(addShape(...shape));
          }
          break;
      }
  };
        return (action) => {
            return next(action);
        }
}    

// export const useReceivedData = (handleShape, handleUndoRedo, allShapes) => {
//   socket.onmessage = (event) => {
//     const parsed = JSON.parse(event.data);
//     switch (parsed.type) {
//       case "id":
//         connectionId = parsed.id;
//         break;
//       case "getShapes":
//         const shapesToServer = { type: "receiveShapes", shapes: allShapes };
//         socket.send(JSON.stringify(shapesToServer));
//         break;
//       case "shape":
//         handleShape(parsed.shape);
//         break;
//       case "receiveShapes":
//         //if shapes is empty then folowing operation will not be excecuted
//         for (const shape of parsed.shapes) {
//           handleShape(shape);
//         }
//         break;
//       case "Undo":
//       case "Redo":
//         handleUndoRedo(parsed);
//         break;
//     }
//   };
// };

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
