import { FETCH_USERS_FAILURE, FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, ADD_USERS_REQUEST, DELETE_USERS_REQUEST } from "./constants"

export const fetchUserRequestAction = () => {
    return {
        type: FETCH_USERS_REQUEST
    }
}

export const addUserAction = (data) => {
    return {
        type: ADD_USERS_REQUEST,
        payload: data
    }
}

export const deleteUserAction = (data) => {
    return {
        type: DELETE_USERS_REQUEST,
        payload: data
    }
}

export const fetchUserSuccessAction = (data) => {
    return {
        type: FETCH_USERS_SUCCESS,
        payload: data
    }
}

export const fetchUserFailureAction = (error) => {
    return {
        type: FETCH_USERS_FAILURE,
        payload: error
    }
}
