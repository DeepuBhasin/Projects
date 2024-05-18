import { call, put } from "redux-saga/effects"
import { fetchUserFailureAction, fetchUserSuccessAction } from "./actions"

// Worker saga
export function* workerfetchUsers() {
    try {
        const data = yield call(fetch, "http://localhost:3001/users");
        const users = yield data.json();
        yield put(fetchUserSuccessAction(users));
    } catch (error) {
        yield put(fetchUserFailureAction(error.message));
    }
}

export function* workerAddUser(action) {
    try {
        yield call(fetch, "http://localhost:3001/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: action.payload })
        });
        const data = yield call(fetch, "http://localhost:3001/users");
        const users = yield data.json();
        yield put(fetchUserSuccessAction(users));

    } catch (error) {
        yield put(fetchUserFailureAction(error));
    }
}

export function* workerDeleteUser(action) {
    try {
        yield call(fetch, `http://localhost:3001/users/${action.payload}`, {
            method: "DELETE",
        });
        const data = yield call(fetch, "http://localhost:3001/users");
        const users = yield data.json();
        yield put(fetchUserSuccessAction(users));
    } catch (error) {
        yield put(fetchUserFailureAction(error));
    }
}