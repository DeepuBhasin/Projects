import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";

// initialState
const initialState = {
    loading: false,
    users: [],
    error: "",
    user: {},
    profile: {},
    userAuth: {
        loading: false,
        error: "",
        userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
    }
};

// create action creator - createAsyncThunk

// register
export const registerUserAction = createAsyncThunk('user/register', async (payload, { rejectWithValue, dispatch, getState }) => {
    try {
        const response = await axios.post(`${baseUrl}/register`, {
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;

    } catch (error) {
        return rejectWithValue(error.response.data || error?.message);
    }
});


// Login
export const loginUserAction = createAsyncThunk('user/login', async (payload, { rejectWithValue, dispatch, getState }) => {
    try {
        const response = await axios.post(`${baseUrl}/login`, {
            email: payload.email,
            password: payload.password
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        // store user data in local storage
        localStorage.setItem("userInfo", JSON.stringify(response.data));

        return response.data;

    } catch (error) {
        return rejectWithValue(error.response.data || error?.message);
    }
});

// Login
export const logoutUserAction = createAsyncThunk('user/logout', async () => {
    localStorage.removeItem("userInfo");
    return null;
});


// get profile
export const getProfileAction = createAsyncThunk('user/profile', async (payload, { rejectWithValue, getState, dispatch }) => {

    try {
        // for token
        const { token, id } = getState().usersData?.userAuth?.userInfo;

        const response = await axios.get(`${baseUrl}/profile`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                userid: id
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data || error?.message);
    }
});

// Create slice
const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUserAction.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(registerUserAction.fulfilled, (state, action) => {
                state.loading = false;
                state.userAuth.userInfo = action.payload;
                state.error = "";
            })
            .addCase(registerUserAction.rejected, (state, action) => {
                state.loading = false;
                state.userAuth.error = action.payload;
                state.error = "";
            })
            .addCase(loginUserAction.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(loginUserAction.fulfilled, (state, action) => {
                state.loading = false;
                state.userAuth.userInfo = action.payload;
                state.error = "";
            })
            .addCase(loginUserAction.rejected, (state, action) => {
                state.loading = false;
                state.userAuth.error = action.payload;
            })
            .addCase(logoutUserAction.fulfilled, (state, action) => {
                state.loading = false;
                state.userAuth.userInfo = null;
                state.error = "";
            }).addCase(getProfileAction.pending, (state, action) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(getProfileAction.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.error = "";
            })
            .addCase(getProfileAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.profile = {};
            })
    },
});

// Export reducer
export const userReducer = userSlice.reducer;
