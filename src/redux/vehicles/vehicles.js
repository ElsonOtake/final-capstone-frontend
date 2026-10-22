/* eslint linebreak-style: ["error", "windows"] */
import { API_URL } from '../../config';
import { getValidAuthSession, clearAuthSession } from '../../utils/auth';

const url = `${API_URL}/api/v1/vehicles`;

// Actions
const GET_VEHICLES_SUCCESS = 'redux/vehicles/GET_VEHICLES_SUCCESS';
const GET_VEHICLES_FAILURE = 'redux/vehicles/GET_VEHICLES_FAILURE';

// Reducer
const vehiclesReducer = (state = [], action = {}) => {
  switch (action.type) {
    case GET_VEHICLES_SUCCESS:
      return action.payload;
    case GET_VEHICLES_FAILURE:
      return [];
    default:
      return state;
  }
};

// Action Creator Thunk
const getVehicles = () => async (dispatch) => {
  try {
    const session = getValidAuthSession('current_user');
    const token = session?.token;

    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { method: 'GET', headers });

    if (response.status === 401) {
      clearAuthSession('current_user');
      dispatch({ type: GET_VEHICLES_FAILURE, payload: 'Unauthorized' });
      return;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: ${response.status}`);
    }

    const data = await response.json();
    const vehicles = Array.isArray(data)
      ? data
      : data.vehicles || data.data || [];

    dispatch({
      type: GET_VEHICLES_SUCCESS,
      payload: vehicles,
    });
  } catch (error) {
    dispatch({
      type: GET_VEHICLES_FAILURE,
      payload: error.message,
    });
  }
};

export { getVehicles, vehiclesReducer };
