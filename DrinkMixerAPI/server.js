const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = 3000;

const arduinoURL = 'http://192.168.1.57/drinkOrder';

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors());

// Path to the JSON file
const filePath = path.join(__dirname, 'drink-data.json');

app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

const drinkOrderLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: 'Too many drink requests, please try again in a few minutes!',
});

// Endpoint to get current selected orders
app.get('/api/drinks/data', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }
        const orderData = JSON.parse(data);
        //console.log(orderData);
        res.json(orderData);
    });
});

// const test = async () => {
//     try {
//         console.log('sending data');
//         const response = await fetch(arduinoURL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ orderData: [0, 0, 0, 0, 0] })
//         });
//         if (response.ok) {
//             const responseText = await response.text();
//             console.log('Server response from Arduino: ', responseText);
//         } else {
//             console.error('Error with Arduino');
//         }
//     } catch (error) {
//         console.error('ERRORRRRRRRR', error);
//     }
// }
// test();


let drinkQueue = [];
let arduinoReady = false;

app.get('/api/drinks/getQueue', (req, res) => {
    //const queue = JSON.parse(drinkQueue);
    res.json(drinkQueue);
});

const processQueue = async () => {
    if (drinkQueue.length > 0 && arduinoReady) {
        arduinoReady = false; //Set flag to false while processing the order
        const order = drinkQueue.shift();
        const orderURL = `?order0=${order[0]}&order1=${order[1]}&order2=${order[2]}&order3=${order[3]}&order4=${order[4]}&order5=${order[5]}&order6=${order[6]}&order7=${order[7]}`;
        const URLToSend = arduinoURL + orderURL;
        try {
            const response = await fetch(URLToSend);
            if (response.ok) {
                const responseText = await response.text();
                console.log('Server response from Arduino: ', responseText);
            } else {
                console.error('Error with Arduino');
            }
        } catch (error) {
            console.error('ERRORRRRRRRR', error);
        }
    }
}

setInterval(processQueue, 1000);

// Endpoint to act as mediary for website and arduino
app.post('/api/drinks/send-order', drinkOrderLimiter, async (req, res) => {
    const order = req.body.orderData;
    drinkQueue.push(order);
    console.log('Added order to queue: ', order);
    res.json({ status: 'Order added to queue' });
});

// Endpoint to update current selected orders
app.post('/api/drinks/update', (req, res) => {
    const newDrinks = req.body;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading file');
            return;
        }

        let orderData = JSON.parse(data);
        orderData = newDrinks;

        fs.writeFile(filePath, JSON.stringify(orderData, null, 2), 'utf8', (err) => {
            if (err) {
                res.status(500).send('Error writing file');
                return;
            }
            res.json({ status: 'success' });
        });
    });
});

app.get('/api/orders/completed', (req, res) => {
    arduinoReady = true;
    console.log('Arduino is ready for the next order');
    res.send('Acknowledged');
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});