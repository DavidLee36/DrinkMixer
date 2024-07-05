import React, { useEffect, useState } from "react";
import './DrinksStyles.css';

const DrinkComponent = ({ drink, drinkNum, updateOrder, orderList }) => {

    const [selectedDrink, setSelectedDrink] = useState(drink);
    const [activePump, setActivePump] = useState(true);

    const [amount, setAmount] = useState(0);

    useEffect(() => {
        //Determine if the pump is currently connected to a drink, if not,
        //change on click and do not show ounces
        if(drink.id === -1) setActivePump(false);
    }, [])

    const handleDrinkClick = () => {
        const userInput = prompt(`How much ${selectedDrink.name} would you like to add? (ounces)`)
        const parsedInput = parseFloat(userInput, 10).toFixed(2);
        if (userInput === null) {
            return
        } else if (!isNaN(parsedInput)) {
            setAmount(parsedInput)
            updateOrder(drinkNum, parsedInput)
        } else {
            alert('Please enter a valid number');
        }
    };

    return (
        <>
        {activePump ? 
            <div className='drink-holder' onClick={handleDrinkClick}>
            <div className="drink-img-container">
                <img src={selectedDrink.picture} alt={selectedDrink.name} />
            </div>
            <div className="drink-label-container">
                <h2>{selectedDrink.name}</h2>
                <h3>Amount: {orderList[drinkNum]} oz.</h3>
            </div>
        </div> : <></>
        } 
        </>
    );
}

export default DrinkComponent;