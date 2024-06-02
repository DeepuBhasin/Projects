import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { userReducer } from "./userSlice";
import { accountReducer } from "./accountSlice";
import { transactionReducer } from "./transactionSlice"

const rootReducer = combineReducers({
    usersData: userReducer,
    accountData: accountReducer,
    transactionData: transactionReducer
});

export const store = configureStore({
    reducer: rootReducer,
});