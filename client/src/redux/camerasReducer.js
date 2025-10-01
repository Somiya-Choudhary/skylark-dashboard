// Initial state
const initialState = {
  cameras: [],
};

// Reducer
export const camerasReducer = (state = initialState, action) => {
  switch (action.type) {
    // Replace the entire cameras array
    case "SET_CAMERAS":
      return {
        ...state,
        cameras: action.payload, // payload should be an array of cameras
      };

    // Add a single camera to the existing array
    case "ADD_CAMERA":
      return {
        ...state,
        cameras: [...state.cameras, action.payload], // payload is a single camera object
      };

    default:
      return state;
  }
};
