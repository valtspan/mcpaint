import { addShape } from "../store/shapes";
import { socket } from "./socket-api";

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
        const allShapes = store.getState.history.past;  
        const shapesToServer = { type: "receiveShapes", payload: allShapes };
        socket.send(JSON.stringify(shapesToServer));
        break;
      case "receiveShapes":
        //if shapes is empty then folowing operation will not be excecuted
        for (const shape of payload) {
          store.dispatch(addShape(shape));
        }
        break;
    }
  };
        return (action) => {
            return next(action);
        }
}    

