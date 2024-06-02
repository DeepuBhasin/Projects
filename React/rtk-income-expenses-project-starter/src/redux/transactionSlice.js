import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { baseUrl } from "../utils/baseUrl";
import axios from "axios";

const initialState = {
    transactions: [],
    transaction: {},
    loading: false,
    error: "",
    isAdded: false,
    success: false,
    isUpdated: false
}

// get all transactions
export const createTransactionAction = createAsyncThunk("transactions/create", async (payload, { rejectWithValue, getState }) => {
    try {
        const { token, id } = getState().usersData?.userAuth?.userInfo;
        const response = await axios.post(`${baseUrl}/transactions`,
            {
                accountId: payload.id,
                name: payload.name,
                transactionType: payload.transactionType,
                amount: payload.amount,
                category: payload.category,
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


const transaction = createSlice({
    name: "account",
    initialState,
    extraReducers: (builder) => {
        builder.addCase(createTransactionAction.pending, (state) => {
            state.loading = true
        }).addCase(createTransactionAction.fulfilled, (state, action) => {
            state.loading = false
            state.isAdded = true
            state.transactions = action.payload
        }).addCase(createTransactionAction.rejected, (state, action) => {
            state.loading = false
            state.isAdded = false
            state.transactions = []
            state.error = action.payload
        })

    }

})
export const transactionReducer = transaction.reducer