import * as React from 'react'
import { useDispatch } from 'react-redux';
import { addUserAction } from "./../redux/actions"

function UserAdd() {
    const [users, setUsers] = React.useState('');

    const dispatch = useDispatch();
    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (users.length === 0) {
            alert('Please Enter User Name');
            return;
        }
        dispatch(addUserAction(users));
    }
    return (
        <div className='user-add'>
            <h2>Add User</h2>
            <form onSubmit={handleSubmitForm}>
                <input type="text" placeholder="Enter Name" required onChange={(e) => setUsers(e.target.value)} />
                <button className='success' type='submit'>Add </button>
                <button className='reset danger' type='reset'>Clear</button>
            </form>
        </div >
    )
}

export default UserAdd