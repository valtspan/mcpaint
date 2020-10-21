import { init, last, head, tail } from "ramda";

export function undoable(reducer) {
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: [],
  };
  return function (state = initialState, action) {
    const { past, present, future } = state;
    switch (action.type) {
      case "Undo":
        const newPast = init(past);
        const previous = last(past);
        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      case "Redo":
        const newFuture = tail(future);
        const next = head(future);
        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        };
      default:
        const newPresent = reducer(present, action);
        // last [shapes] === new [shapes] => don't add anything to history
        //  actually, it's used in those cases, when nothing is added to canvas,
        // and current action is about changing an active tool or something like that
        if (present === newPresent) {
          return state;
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
        };
    }
  };
}
