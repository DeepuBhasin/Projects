import * as React from 'react';
import { fetchUserRequestAction, deleteUserAction } from "../redux/actions"
import { useDispatch, useSelector } from 'react-redux';

export const UserList = () => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(fetchUserRequestAction())
    }, [dispatch])

    const users = useSelector(state => state.userReducer);

    const handleDelete = (id) => {
        return window.confirm('Are you sure want to delete user ?') && dispatch(deleteUserAction(id))
    }

    return (<React.Fragment>
        {users.loading && <h2>loading...</h2>}
        {users.error && <h2>{users.error}</h2>}
        {
            users.loading === false && users.users.length > 0 && (
                <div className='user-list'>
                    <h2>User List</h2>
                    <ul>
                        {users.users.map(user => <li key={user.id}>{user.name} <button className='danger user-delete' onClick={() => handleDelete(user.id)}>Delete </button></li>)}
                    </ul>
                </div>
            )
        }

    </React.Fragment>)
}