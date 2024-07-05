import React, { useState } from 'react'
import drinksData from '../assets/drink-data.json';

// !!! IMPORTANT || The admin page is not fully polished as it was intended
// to be viewed only by me on my pc. Therefore, it may not look the best on all
// screen sizes and systems

const AdminDrinkComponent = ({ drink, updateSelected, index }) => {
    const [selectedDrink, setSelectedDrink] = useState(drink);

    const handleDropdownChange = (event) => {
        event.stopPropagation();
        const selectedID = parseInt(event.target.value, 10);
        const newDrink = drinksData.drinks.find(d => d.id === selectedID)
        setSelectedDrink(newDrink);

        updateSelected(index, newDrink);
    };

    return (
        <div className='drink-holder'>
            <div className="drink-img-container">
                <img src={selectedDrink.picture} alt={selectedDrink.name} />
            </div>
            <h2>{selectedDrink.name}</h2>
            <div className="label-container">
                <label htmlFor="dropdown">Change drink:</label>
            </div>
            <select id="dropdown" onChange={handleDropdownChange} value={selectedDrink.id}>
                {drinksData.drinks.map((drink) => {
                    return <option value={drink.id} key={drink.id}>{drink.name}</option>
                })}
            </select>
        </div>
    )
}

export default AdminDrinkComponent