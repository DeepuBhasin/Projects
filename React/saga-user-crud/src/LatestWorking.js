/*
Redux-saga is a library that allows you to write asynchronous code in a very clean and concise way.
*/

/* This is Set up code which always write in every project*/
import * as React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { combineReducers, createStore, applyMiddleware, } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { myFirstReducer } from "./saga/reducer";
import mySaga from "./saga/sagas"
import { GET_USERS_FETCH, getUserFetch } from "./saga/actions"

const sagaMiddleware = createSagaMiddleware();

const rooReducer = combineReducers({ myFirstReducer });
const store = createStore(rooReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(mySaga);

export default function App() {
    return (
        <Provider store={store}>
            <ShowDataComponent />
        </Provider>
    );
}

function ShowDataComponent() {
    const { users } = useSelector((state) => state.myFirstReducer);
    const dispatch = useDispatch();
    const data = users.map((item) => (
        <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
        </tr>
    ));
    return (
        <div className="App">
            {/* we never send payload in action from here */}
            <button onClick={() => dispatch({ type: GET_USERS_FETCH })}>Fetch Data</button>
            <table border="2" cellPadding="2" cellSpacing="3" style={{ textAlign: 'center' }}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>{data}</tbody>
            </table>
        </div >
    );
}