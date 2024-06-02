import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { baseUrl } from "../utils/baseUrl";
import axios from "axios";
const initialState = {
    account: null,
    accounts: [],
    error: '',
    loading: false,
    success: false,
    isUpdated: false
}


// account to create account/project

export const createAccountAction = createAsyncThunk("account/create", async (payload, { rejectWithValue, getState }) => {
    try {
        // for token
        const { token, id } = getState().usersData?.userAuth?.userInfo;

        const response = await axios.post(
            `${baseUrl}/accounts`,
            {
                name: payload.name,
                accountType: payload.accountType,
                initialBalance: payload.initialBalance,
                notes: payload.notes
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    userid: id
                }
            }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data || error?.message);
    }
});

// get single account
export const getSingleAccountAction = createAsyncThunk("account/getAccount", async (payload, { rejectWithValue, getState }) => {
    try {
        const { token, id } = getState().usersData?.userAuth?.userInfo;
        const response = await axios.get(`${baseUrl}/accounts/${payload}`, {
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


// update account
export const updateAccountAction = createAsyncThunk("account/updateAccount", async (payload, { rejectWithValue, getState }) => {
    try {
        const { token, id } = getState().usersData?.userAuth?.userInfo;
        const response = await axios.put(`${baseUrl}/accounts/${payload.id}`, {
            name: payload.name,
            accountType: payload.accountType,
            initialBalance: payload.initialBalance,
            notes: payload.notes
        }, {
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

const accountSlice = createSlice({
    name: "account",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(createAccountAction.pending, (state) => {
                state.loading = true
            })
            .addCase(createAccountAction.fulfilled, (state, action) => {
                state.loading = false
                state.success = true
                state.account = action.payload
            })
            .addCase(createAccountAction.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.account = null;
                state.error = action.payload;
            }).
            addCase(getSingleAccountAction.pending, (state) => {
                state.loading = true
            })
            .addCase(getSingleAccountAction.fulfilled, (state, action) => {
                state.loading = false
                state.success = true
                state.account = action.payload
            })
            .addCase(getSingleAccountAction.rejected, (state, action) => {
                state.loading = false;
                state.success = false
                state.account = null;
                state.error = action.payload;
            }).addCase(updateAccountAction.pending, (state) => {
                state.loading = true
            })
            .addCase(updateAccountAction.fulfilled, (state, action) => {
                state.loading = false
                state.success = true
                state.isUpdated = true
                state.account = action.payload
            })
            .addCase(updateAccountAction.rejected, (state, action) => {
                state.loading = false;
                state.success = false
                state.account = null;
                state.error = action.payload;
                state.isUpdated = false
            })
    }

})
export const accountReducer = accountSlice.reducer