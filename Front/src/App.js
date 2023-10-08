import React, { useState, useEffect } from 'react';
import './App.css';
import jwt_decode from 'jwt-decode';
import swal from "sweetalert";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FormAuth from './pages/auth/FormAuth';
import Home from "./pages/Home";

function App() {
    const token = sessionStorage.getItem('token');

    if (!token) {
        return <FormAuth />
    }
    const token_decoded = jwt_decode(token)
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (token_decoded.exp < currentTime) {
        swal("Failed", "Your session expired", "error")
        sessionStorage.removeItem('token')
        return <FormAuth />
    }

    return (
        <div className="wrapper">
            <BrowserRouter>
                <Routes>
                    <Route path="/home" element={<ProfileContainer id_user={token_decoded.id_user} token={token} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

function ProfileContainer({ id_user, token }) {
    const [profileData, setProfileData] = useState(null);

    console.log(token)
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL}/users/${id_user}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `${token}`
            },
        })
            .then(response => response.json())
            .then(data => {
                setProfileData(data);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
            });
    }, [id_user]);

    if (profileData === null) {
        return <div>Loading...</div>;
    }

    return <Home data={profileData} />;
}

export default App;
