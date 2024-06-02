import React from 'react'
import { useSelector } from 'react-redux'
export function AuthRoute({ children }) {
    const { userInfo } = useSelector((state) => state.usersData?.userAuth);

    if (!userInfo?.token) {
        window.location.href = "/login";
        return null;
    }

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}
