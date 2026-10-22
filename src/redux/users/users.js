import { API_URL } from '../../config';
/* eslint linebreak-style: ["error", "windows"] */
import { getValidAuthSession, clearAuthSession } from '../../utils/auth';

const url = `${API_URL}/api/v1/users`;

// Action Types
const GET_RESERVATIONS_SUCCESS = 'redux/users/GET_RESERVATIONS_SUCCESS';
const GET_RESERVATIONS_FAILURE = 'redux/users/GET_RESERVATIONS_FAILURE';

// Reducer
const reservationsReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_RESERVATIONS_SUCCESS:
      return action.payload;
    case GET_RESERVATIONS_FAILURE:
      return [];
    default:
      return state;
  }
};

// Async Action Creator
const getReservations = () => async (dispatch) => {
  try {
    const session = getValidAuthSession('current_user');

    // Guard against unauthenticated state
    if (!session || !session.token || !session.id) {
      clearAuthSession('current_user');
      return;
    }

    const response = await fetch(`${url}/${session.id}/bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (response.status === 401) {
      clearAuthSession('current_user');
      return;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch bookings: ${response.status}`);
    }

    const reservations = await response.json();
    dispatch({
      type: GET_RESERVATIONS_SUCCESS,
      payload: Array.isArray(reservations) ? reservations : [],
    });
  } catch (error) {
    dispatch({
      type: GET_RESERVATIONS_FAILURE,
      payload: error.message,
    });
  }
};

export { getReservations, reservationsReducer };
