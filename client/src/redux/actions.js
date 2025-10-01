// action types
export const SETUSER = "SETUSER";
export const SET_CAMERAS = "SET_CAMERAS";
export const ADD_CAMERA = "ADD_CAMERA";

// action creators
export const setUser = (payload) => ({
  type: SETUSER,
  payload,
});

export const setCameras = (payload) => ({
  type: SET_CAMERAS,
  payload,
});

export const addCamera = (payload) => ({
  type: ADD_CAMERA,
  payload,
});

