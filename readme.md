# DrinkMixer Project

## Overview
The DrinkMixer project allows users to create drink combinations and send them over WiFi to be prepared. The primary audience is viewers and followers of my content, as this project will be used for engaging and interactive content. Users can send their wacky drink ideas for me to try.

## Features
- **Easy-to-use interface:** Mix drinks or choose from premade recipes.
- **API Integration:** A custom API handles sending and receiving data between the Raspberry Pi and Arduino.
- **Premade Recipes:** Users can select from a variety of premade recipes.

## Hardware
- Raspberry Pi 4 (8GB)
- Arduino Uno R4 WiFi
- 8 12V water pumps
- 8-channel relay board
- Water pump tubes
- (Optional) NEMA 17 stepper motor with a lead screw (for the original version)

## Fusion 360 Models
- **DrinkMixerV2:** The current version featured in videos.
- **DrinkMixerV1:** The original version design.

## Arduino Code
The Arduino controls the 8 water pumps and communicates with the Raspberry Pi to receive order data. The pumps operate based on this data.

## Raspberry Pi API
The Raspberry Pi acts as a middleman between users and the Arduino. It:
- Sends drink data, including available drinks and recipes, to users.
- Manages a drink queue since the Arduino can only make one drink at a time.
- Communicates with the Arduino to instruct it on which drink to make.

## Setup Instructions
### Prerequisites
- Ensure your IPs and WiFi settings are correctly configured as they are specific to your setup.
- Basic knowledge of setting up a Vite/React site.

### Steps
1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/DrinkMixer.git
    cd DrinkMixer
    ```

2. **Setup the Raspberry Pi API:**
    ```bash
    cd DrinkMixerAPI
    npm install
    node server.js
    ```

3. **Setup the React Website:**
    ```bash
    cd ../drink-mixer-web
    npm install
    npm run dev
    ```

4. **Arduino:**
    - Upload the Arduino code found in the `Arduino` folder to your Arduino Uno R4 WiFi.

### Usage
Navigate to `sleepyjoesaloon.com` and create any drink combination. Click the "Make Drink" button to send the order.

## License
This project is released under a "please credit me if you use it" license.

## Acknowledgments
Thanks to everyone who visits the website and checks out my YouTube/TikTok videos.

## Contact
- **Email:** [david303lee@gmail.com](mailto:david303lee@gmail.com)
- **LinkedIn:** [David Lee](https://www.linkedin.com/in/david-lee-499a4a237/)

## Hidden Admin Page
The website features a hidden admin page where I update the currently selected drinks on the mixer.
