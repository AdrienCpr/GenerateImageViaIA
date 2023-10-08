import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Notez l'utilisation de Routes
import Signin from './pages/Signin';
import Profile from './pages/Profile';
import jwt_decode from 'jwt-decode';
import swal from "sweetalert";

function App() {
    const token = sessionStorage.getItem('token');

    if (!token) {
        return <Signin />
    }
    const token_decoded = jwt_decode(token)
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (token_decoded.exp < currentTime) {
        swal("Failed", "Your session expired", "error")
        sessionStorage.removeItem('token')
        return <Signin />
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

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL}/users/${id_user}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : token
            },
        })
            .then(response => response.json()) // Parsez la réponse en JSON
            .then(data => {
                setProfileData(data);
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
                // Gérer l'erreur ici
            });
    }, [id_user]); // Ajoutez id_user dans les dépendances du hook useEffect

    if (profileData === null) {
        // Vous pouvez afficher un indicateur de chargement ici pendant la requête
        return <div>Loading...</div>;
    }

    return <Profile data={profileData} />;
}

export default App;
