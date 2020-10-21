export const addShape = (shape) => ({
  type: "Add_shape",
  shape,
});

export const shapes = (state = [], action) => {
  switch (action.type) {
    case "Add_shape":
      return [...state, action.shape];
    default:
      return state;
  }
};
