import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


const SecretListener = () => {
    const navigate = useNavigate();

    const keyMap = {
        p: false,
        e: false,
        n: false,
        i: false,
        s: false,
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (keyMap.hasOwnProperty(e.key)) {
                keyMap[e.key] = true;
                let secretCode = true;
                for(const [key, value] of Object.entries(keyMap)) {
                    if(!value) secretCode = false;
                }
                if (secretCode) {
                    localStorage.setItem('secretLogin', 'true');
                    navigate('/login');
                }
            }
        };

        const handleKeyUp = (e) => {
            if (keyMap.hasOwnProperty(e.key)) {
                keyMap[e.key] = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);
    
    return (
        null
    )
}

export default SecretListener