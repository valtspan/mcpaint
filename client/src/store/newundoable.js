import { head, last, filter, indexOf, insert, without } from "ramda";

export const newundoable = (shapes) => {
  const initialState = {
    //past: shapes(undefined, {}),
    past: [],
    future: [],
  };
  return (state = initialState, action) => {
    const { past, future } = state;
    let newPast = [];
    let newFuture = [];
    switch (action.type) {
      case "Undo":
        const toBeUndone = last(
          filter((shape) => shape.id === action.id, past)
        );
        const toFuture = {
          position: indexOf(toBeUndone, past),
          shape: toBeUndone,
        };
        newPast = without([toBeUndone], past);
        newFuture = [toFuture, ...future];
        return {
          past: newPast,
          future: newFuture,
        };
      case "Redo":
        const toBeRedone = head(
          filter((item) => item.shape.id === action.id, future)
        );
        const toPast = toBeRedone.shape;
        newPast = insert(toBeRedone.position, toPast, past);
        newFuture = without([toBeRedone], future);
        return {
          past: newPast,
          future: newFuture,
        };
      default:
        //TODO
        //change later
        if (action.type === "Add_shape") {
          const hasIds = future.some((item) => item.shape.id === action.id);
          if (hasIds) {
            newFuture = without(
              filter((item) => item.shape.id === action.id, future),
              future
            );
          } else {
            newFuture = future;
          }
        }
        //we must call all reducers to find matching case (for action)
        const newState = shapes(past, action);
        //if after previous line state didn't change then return state
        //states are compared by reference
        if (past === newState) {
          return state;
        }
        return {
          past: newState,
          future: newFuture,
        };
    }
  };
};
