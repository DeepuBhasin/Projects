import { } from "redux-saga"
import { takeLatest } from "redux-saga/effects"
import { FETCH_USERS_REQUEST, ADD_USERS_REQUEST, DELETE_USERS_REQUEST } from "./constants";
import { workerfetchUsers, workerAddUser, workerDeleteUser } from "./services"

// Watcher saga
export function* mySaga() {
    yield takeLatest(FETCH_USERS_REQUEST, workerfetchUsers);
    yield takeLatest(ADD_USERS_REQUEST, workerAddUser);
    yield takeLatest(DELETE_USERS_REQUEST, workerDeleteUser);
}