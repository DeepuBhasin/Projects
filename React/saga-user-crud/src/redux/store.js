import { createStore, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import { userReducer } from "./reducer";
import { mySaga } from "./sagas";
import { Provider } from "react-redux"

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({ userReducer: userReducer });
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(mySaga);


export const MyProvider = ({ children }) => {
    return <Provider store={store}>{children}</Provider>
}