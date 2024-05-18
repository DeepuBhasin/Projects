import React from 'react'
import { UserList } from "./UserList"
import { MyProvider } from "./../redux/store";
import "./user.css"
import UserAdd from './UserAdd';

export const User = () => (
    <MyProvider>
        <div className='container'>
            <UserAdd />
            <UserList />
        </div>
    </MyProvider>)

export default <User />