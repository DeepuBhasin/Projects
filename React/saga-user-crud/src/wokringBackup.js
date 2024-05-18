import React from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put, take, call, select } from 'redux-saga/effects';

// Constants
const DELETE_DATA = 'DELETE_DATA';
const FETCH_POSTS_REQUEST = 'FETCH_POSTS_REQUEST';
const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';


// Action Creators
function fetchPostsRequestAction() {
    return { type: FETCH_POSTS_REQUEST }
};

function fetchPostsSuccess(data) {
    return { type: FETCH_POSTS_SUCCESS, payload: data }
};

function fetchPostsFailure(error) {
    return { type: FETCH_POSTS_FAILURE, payload: error }
};

function deletePostAction() {
    return { type: DELETE_DATA, payload: [] }
};

// Initial state
const initialPostData = {
    posts: [],
    loading: false,
    error: null,
};

// Reducer
const postReducer = (state = initialPostData, action) => {
    switch (action.type) {
        case FETCH_POSTS_REQUEST: {
            return { ...state, loading: true, error: null, posts: [] };
        }
        case FETCH_POSTS_SUCCESS: {
            return { ...state, loading: false, posts: action.payload, error: null };
        }
        case FETCH_POSTS_FAILURE: {
            return { ...state, loading: false, error: action.payload.error };
        }
        case DELETE_DATA: {
            return initialPostData;
        }
        default: {
            return state;
        }
    }
};

// Middleware
function* getPost() {
    const data = yield select(state => state.post)
    console.log('state', data);
    try {
        const response = yield fetch('https://jsonplaceholder.typicode.com/posts');
        const responseData = yield response.json();
        yield put(fetchPostsSuccess(responseData));
    } catch (error) {
        yield put(fetchPostsFailure(error));
    }
}
function* DummyFnx(action) {
    yield 1;
    console.log("This is dummy function");
    console.log(action);
    yield put(fetchPostsSuccess(action.payload))
}

function* PostSageFunction() {
    yield takeEvery(FETCH_POSTS_REQUEST, getPost);
    yield takeEvery("Dummy", DummyFnx);
}

// Store
const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    const rootReducer = combineReducers({
        post: postReducer,
    });
    const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(PostSageFunction);
    return store;
}

// Test component
function ShowDataComponent() {
    const { posts, loading } = useSelector((state) => state.post);
    const dispatch = useDispatch();

    const data = posts.map((item) => (
        <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.title}</td>
        </tr>
    ));

    return (
        <div className="App">
            <button onClick={() => dispatch(fetchPostsRequestAction())}>Fetch Data</button>
            <button onClick={() => dispatch(deletePostAction())}>Delete Data</button>
            <button onClick={() => dispatch({ type: "Dummy", payload: [{ id: 1, title: "dp" }, { id: 2, title: "deep" }] })}>Dummy</button>

            {loading && <h1>Loading...</h1>}

            {!loading && (
                <table border="2" cellPadding="2" cellSpacing="3" style={{ textAlign: 'center' }}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                        </tr>
                    </thead>
                    <tbody>{data}</tbody>
                </table>
            )}
        </div>
    );
}

// App component
const App = () => {
    const store = configureStore();
    return <Provider store={store}>
        <ShowDataComponent />
    </Provider>
};

export default App;
