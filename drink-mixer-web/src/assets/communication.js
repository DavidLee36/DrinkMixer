const URL = 'http://192.168.1.57/drinkOrder';
const serverURL = 'https://api.sleepyjoesaloon.com'
const PUBLICURL = import.meta.env.VITE_PUBLIC_IP;
const LOCALURL = import.meta.env.VITE_LOCAL_IP;

const drinksJSON = import('../assets/drink-data.json');

//This will most likely end up being removed
//Used for testing communication directly with Arduino and bypassing
//Raspberry Pi
export const communicateWithArduino = async (drinkOrder) => {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderData: drinkOrder })
        });
        if (response.ok) {
            const responseText = await response.text();
            console.log('Server response from Arduino: ', responseText);
        } else {
            console.error('Error with Arduino');
        }
    } catch (error) {
        console.error(error);
        alert('Error sending order, check console for more info');
    }
}

const getAPIURL = () => {
    if(process.env.NODE_ENV === 'development') {
        return LOCALURL;
    }else {
        return serverURL;
    }
}

export const sendDrinkOrder = async (drinkOrder) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 5000); // Set timeout to 5 seconds

    try {
        const apiURL = getAPIURL();
        const response = await fetch(`${apiURL}/api/drinks/send-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderData: drinkOrder }),
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (response.status === 429) { //Raspberry Pi has seen too many drink requests from this user
            console.error('Too many requests: ', response.statusText);
            alert('You are sending requests too quickly. Please wait a moment before trying again.');
        } else if (response.ok) {
            const responseText = await response.text();
            console.log('Server response: ', responseText);
            alert('Drink order successfully placed!');
        } else {
            console.error('Error sending order:', response.statusText);
            alert('Error sending order. Please try again later.');
        }
    } catch (error) {
        console.error('Error sending order:', error);
        alert('An error occurred while sending the order. Raspberry Pi server most likely offline');
    }
}

//Retrieve the 8 current drinks from the Raspberry Pi server,
//If any issues return default drink selection
export const retrieveDrinks = async () => {
    let drinkData = drinksJSON; //Fallback to returning locally saved data

    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
    }, 5000); // Set timeout to 5 seconds
    try {
        const apiURL = getAPIURL();
        const response = await fetch(`${apiURL}/api/drinks/data`, {
            signal: controller.signal
        });
        clearTimeout(timeout);
        drinkData = await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Error retreiving drinks, falling back to default list');
        }
        console.error('error receiving drink info, falling back to default list: ', error);
    }
    console.log(drinkData)
    return drinkData;
}

export const updateDrinkJSON = async (updatedFile) => {
    let alertMsg = '';
    try {
        const apiURL = getAPIURL();
        const response = await fetch(`${apiURL}/api/drinks/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedFile)
        });

        if (response.ok) {
            console.log('Drink data updated successfully');
            alertMsg = 'Drink data updated successfully';
        } else {
            console.error('Failed to update drink data');
            alertMsg = 'Error sending updated drink info';
        }
    } catch (error) {
        console.error('Error sending updated drink info: ', error);
        alertMsg = 'Error sending updated drink info';
    }
    alert(alertMsg);
}

export const retreiveQueue = async () => {
    try {
        const apiURL = getAPIURL();
        const response = await fetch(`${apiURL}/api/drinks/getQueue`);
        const queue = await response.json();
        return queue
    } catch (error) {
        alert('Error, check console for more info');
        console.error('Error retreiving drink queue: ', error);
    }
}