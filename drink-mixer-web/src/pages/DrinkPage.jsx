import React, { useState, useEffect } from 'react';
import DrinkComponent from './DrinkComponent';
import './DrinksStyles.css';
import { retrieveDrinks, sendDrinkOrder } from '../assets/communication';


const DrinkPage = () => {

    const [order, setOrder] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [recipes, setRecipes] = useState([]);
    const [currentDrinks, setCurrentDrinks] = useState([]);
    const maxVolume = 14;

    useEffect(() => {
        const setDrinkData = async () => {
            const drinks = await retrieveDrinks();
            setCurrentDrinks(drinks.currDrinks);

            //Filter recipes so that only possible recipes can be made
            const availableDrinkIDs = drinks.currDrinks.map(drink => drink.id);
            console.log(drinks.recipes)
            setRecipes(drinks.recipes.filter(recipe => recipe.idList.every(id => availableDrinkIDs.includes(id))));
        }
        setDrinkData();
    }, []);

    const updateOrder = (drinkNumber, drinkAmount) => {
        const updatedOrder = [...order];
        updatedOrder[drinkNumber] = drinkAmount;
        setOrder(updatedOrder);
    };

    //Handle send drink order button
    const sendData = async () => {
        console.log(order)
        let volume = 0;
        order.forEach(drink => volume += parseFloat(drink)); //Calc volume of requested drink
        console.log(volume);
        if (volume <= maxVolume && volume !== 0) {
            await sendDrinkOrder(order);
        }else if(volume === 0) {
            alert('Please add at least a teensy weensy bit of liquid pretty please');
        }else {
            alert(`Max drink volume exceeded, max volume is ${maxVolume}`);
        }
    };

    const handleRecipeClick = (recipe) => {
        const newOrder = [0, 0, 0, 0, 0, 0, 0, 0]; //Reset all drink amounts
        
        //For each recipe ID, udpate the amount for the corresponding drink in
        //the newOrder array
        recipe.idList.forEach((id, index) => {
            const drinkIndex = currentDrinks.findIndex(drink => drink.id === id);
            if(drinkIndex !== -1) {
                newOrder[drinkIndex] = recipe.amounts[index];
            }
        });
        setOrder(newOrder);
    }

    const handleOnClear = () => {
        setOrder([0, 0, 0, 0, 0, 0, 0, 0]);
    }

    return (
        <div className='page-wrapper'>
            <h1>Sleepy Joe's Saloon</h1>
            <h3>Click on a drink to choose the amount to pour, or choose from a pre made recipe!</h3>
            {currentDrinks.length === 0 &&
                <div className="loader-container">
                    <span className="loader"></span>
                    <h1>Loading Drinks...</h1>
                </div>
            }
            {currentDrinks.length !== 0 &&
            <>
                <div className="main-body">
                    <div className="drinks-wrapper">
                        {currentDrinks.map((drink, index) => (
                            <DrinkComponent
                            key={index}
                            drink={drink}
                            drinkNum={index} updateOrder={updateOrder}
                            orderList={order}
                        />
                        ))}
                    </div>
                    <div className="recipes-wrapper">
                        <h2>Available Pre Made Recipes:</h2>
                        <div className="recipe-list">
                            {recipes.map((recipe, index) => (
                                <button className="recipe" onClick={()=>handleRecipeClick(recipe)} key={index}>
                                    {recipe.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="button-wrapper">
                    <button className="btn-clear" onClick={handleOnClear}>Clear Selection</button>
                    <button className='btn-send' onClick={sendData}>Make Drink</button>
                </div>
            </>
            }
        </div>
    );
}

export default DrinkPage;