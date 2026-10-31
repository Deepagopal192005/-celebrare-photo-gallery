/**
 * Favourites are stored as an array of photo IDs.
 * Supported actions: ADD_FAVOURITE and REMOVE_FAVOURITE.
 */
export function favouritesReducer(state, action) {
  switch (action.type) {
    case "ADD_FAVOURITE":
      // Avoid adding the same photo twice.
      return state.includes(action.photoId)
        ? state
        : [...state, action.photoId];

    case "REMOVE_FAVOURITE":
      return state.filter((id) => id !== action.photoId);

    default:
      return state;
  }
}

export function getInitialFavourites() {
  try {
    const saved = localStorage.getItem("celebrare-favourites");
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // If storage contains invalid JSON, start with an empty list.
    return [];
  }
}