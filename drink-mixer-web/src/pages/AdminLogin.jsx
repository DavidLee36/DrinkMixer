import React, { useState, useEffect } from 'react';

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

import { useNavigate } from 'react-router-dom';

import './AdminStyles.css';

// !!! IMPORTANT || The admin page is not fully polished as it was intended
// to be viewed only by me on my pc. Therefore, it may not look the best on all
// screen sizes and systems

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const secretLogin = localStorage.getItem('secretLogin');

        //Only allow the user to visit the login page if it was through the 'secret code'
        if(!secretLogin) {
            console.log('no secret log in for you stinky boy');
            navigate('/');
        }else {
            //localStorage.removeItem('secretLogin');
        }
    }, [navigate]);


    const handleSubmition = (e) => {
        e.preventDefault();
        if(username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem('loggedIn', 'true');
            navigate('/adminpage');
        }else {
            alert('wrong username or password pussy');
        }
    }

    return (
        <div className='admin-login admin'>
            <h1>well well well...</h1>
            <h1>You've located my secret login you little stinker you</h1>
            <form onSubmit={handleSubmition}>
                <div className="form-inputs">
                    <input type="text" placeholder='username' onChange={(e)=>setUsername(e.target.value)}/>
                    <input type="password" placeholder='password' onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                <button className='admin-button'>Submit</button>
            </form>
        </div>

    )
}

export default AdminLogin