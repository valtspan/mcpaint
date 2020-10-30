// export const addShape = (shape) => ({
//   type: "Add_shape",
//   shape,
// });

export const addShape = (id, payload) => ({
  type: "Add_shape",
  id,
  payload
})

export const shapes = (state = [], action) => {
  switch (action.type) {
    case "Add_shape":
      return [...state, { id: action.id, payload: action.payload }];
    default:
      return state;
  }
};
