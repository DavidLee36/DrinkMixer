import React, { useState, useEffect } from 'react';
import AdminDrinkComponent from './AdminDrinkComponent';
import { useNavigate } from 'react-router-dom';
import { retreiveQueue, retrieveDrinks, updateDrinkJSON } from '../assets/communication';
import localDrinkFile from '../assets/drink-data.json';

// !!! IMPORTANT || The admin page is not fully polished as it was intended
// to be viewed only by me on my pc. Therefore, it may not look the best on all
// screen sizes and systems

const AdminPage = () => {
    const navigate = useNavigate();

    const [drinks, setDrinks] = useState();
    const [currSelected, setCurrSelected] = useState([]);

    useEffect(() => {
        const adminLoggedIn = localStorage.getItem('loggedIn');

        const setDrinkData = async () => {
            const drinkData = await retrieveDrinks();
            setDrinks(drinkData);
            setCurrSelected(drinkData.currDrinks);
        }
        
        //Similarily to login screen, if the user is not logged in as admin simply redirect them to home page
        if(!adminLoggedIn) {
            //navigate('/');
        }else {
            //localStorage.removeItem('loggedIn');
            setDrinkData();
        }
    }, [navigate]);

    const updateDrinks = (idx, drink) => {
        const updatedDrinks = [...currSelected];
        updatedDrinks[idx] = drink;
        setCurrSelected(updatedDrinks);
        console.log(updatedDrinks);
    }

    const saveDrinks = async () => {
        const updatedDrinks = {
            ...localDrinkFile,
            currDrinks: currSelected
        }
        await updateDrinkJSON(updatedDrinks);
    }

    const displayQueue = async () => {
        const queue = await retreiveQueue();
        console.log('current drink queue: ', queue);
        alert('Drink queue sent to console');
    }

    return (
        <div className='admin-wrapper admin'>
            <h1>admin page</h1>
            <div className="selected-drinks-container">
                {currSelected.map((drink, idx)=><AdminDrinkComponent key ={idx} drink={drink} updateSelected={updateDrinks} index={idx}/>)}
            </div>
            <div className="admin-button-container">
                <button className='admin-button' onClick={saveDrinks}>
                    Save Drink Changes
                </button>
                <button className="admin-button" onClick={displayQueue}>Get Queue</button>
            </div>
        </div>
    )
}

export default AdminPage