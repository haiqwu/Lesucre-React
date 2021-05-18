export const cartReducer = (state = [], action) => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      state = JSON.parse(localStorage.getItem("cart"));
    }
  }

  switch (action.type) {
    case "UPDATE_CART":
      return action.payload;
    default:
      return state;
  }
};
