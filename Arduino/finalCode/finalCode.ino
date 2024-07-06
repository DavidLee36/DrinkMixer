#include <WiFiS3.h>
#include <ArduinoJson.h>
#include <AccelStepper.h>
#include "Arduino_LED_Matrix.h"

ArduinoLEDMatrix matrix;
const int numRows = 8;
const int numColumns = 12;
byte frame[numRows][numColumns];


// STUPID FUCKING ERROR LIGHT IF THIS TURNS ON AN ERROR HAPPENED AND NO ONE IS HAPPY ABOUT IT
const int errorLED = A0;

// Wifi variables
const char* ssid = "WIFI SSID";
const char* password = "WIFI PASSWORD";
WiFiServer server(80);

// Used for receiving data from web server
double orderData[8] = {0.0}; // double array containing ounce amount for each drink

const int switchPin = 10; //Limit switch which is being used as button
int drinkPumps[8] = {2, 3, 4, 5, 6, 7, 8, 9}; // Relay pins for water pumps
const double ouncesPerSecond = 1.127; // Pumps pump ~ 1.127 ounce/second

bool pendingOrder = false;

const unsigned long clientTimeout = 5000; // Timeout in milliseconds when reading client URL

void setup() {
    Serial.begin(115200);
    wifiSetup(); // Setup wifi connection and web server
    pinMode(switchPin, INPUT_PULLUP);
    setupPumps();
    matrix.begin();
    sendCompletionNotification(); //Send an initial 'Arduino is ready' message to ras pi on Arduino boot up
}

void loop() {
    handleWifiShit();

    if(pendingOrder && !digitalRead(switchPin)) { //We have a pending order and button was pressed
        Serial.println("Button pressed, making drink!");
        delay(1000);
        makeDrink();
        pendingOrder = false;
        sendCompletionNotification();
    }
}

void setupPumps() {
    for(int i = 0; i < 8; i++) {
        pinMode(drinkPumps[i], OUTPUT);
    }
}

void makeDrink() {
    for (int i = 0; i < 8; i++) {
        if(orderData[i] > 0) { // If the current drink has an amount greater than 0
            Serial.print("Preparing drink at index ");
            Serial.println(i);
            Serial.print("amount (oz): ");
            Serial.println(orderData[i]);
            pourDrink(i, orderData[i]);
        }
    }
}

void pourDrink(int cupPos, double ounces) {
    double seconds = ounces / ouncesPerSecond;
    int microSeconds = int(seconds * 1000);

    digitalWrite(drinkPumps[cupPos], HIGH);
    delay(microSeconds);
    digitalWrite(drinkPumps[cupPos], LOW);

    delay(500);
}

// !!!!!!!! WIFI / COMMUNICATION FUNCTIONS !!!!!!!!!
void wifiSetup() { //Setup web server
    Serial.print("Connecting to WiFi...");
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected.");

    server.begin();
    Serial.println("Server started");
    Serial.println("Use this URL to connect: ");
    Serial.println("http://" + WiFi.localIP().toString() + "/drinkOrder");
    pinMode(errorLED, OUTPUT);
}

// Method to handle wifi coms, process client request
void handleWifiShit() {
    WiFiClient client = server.available();
    if (client) {
        Serial.println("New Client connected");
        unsigned long startTime = millis();
        String url = "";
        while (client.connected() && (millis() - startTime < clientTimeout)) {
            if (client.available()) {
                url = client.readStringUntil('\r');
                break;
            }
        }
        if(url.length() == 0) { //Ideally this won't happen but this if the ras pi connects but arduino takes too long to read URL
            Serial.println("Client connection timed out");
            client.stop();
            return;
        }
        
        Serial.print("Received URL: ");
        Serial.println(url);
        if (url.startsWith("GET ")) {
            int startIndex = url.indexOf('?') + 1;
            if (startIndex > 0) {
                String queryParams = url.substring(startIndex, url.indexOf(' ', startIndex));
                Serial.print("Query Params: ");
                Serial.println(queryParams);
                parseQueryParams(queryParams);
                pendingOrder = true;
                handleDrinkLED();
            }
        }

        // Send response to client
        client.println("HTTP/1.1 200 OK");
        client.println("Content-Type: text/plain");
        client.println("Connection: close");
        client.println();
        client.println("Drink order received");
        
        client.stop();
        Serial.println("Client disconnected");
    }
}

void parseQueryParams(String queryParams) { //Method to handle reading drink amounts
    int pumpIndex = 0;
    
    int start = 0;
    while (start < queryParams.length()) { //Loop through the params and find each drink volume
        int end = queryParams.indexOf('&', start);
        if (end == -1) {
            end = queryParams.length();
        }
        
        String param = queryParams.substring(start, end);
        int equalsIndex = param.indexOf('=');
        if (equalsIndex != -1) {
            String key = param.substring(0, equalsIndex);
            String value = param.substring(equalsIndex + 1);
            Serial.print("Key: ");
            Serial.print(key);
            Serial.print(" Value: ");
            Serial.println(value);
        
            if (key.startsWith("order")) {
                pumpIndex = key.substring(5).toInt();
                if (pumpIndex >= 0 && pumpIndex < 8) {
                    orderData[pumpIndex] = value.toDouble();
                }
            }
        }
        start = end + 1;
    }
}


void sendCompletionNotification() { //Let the ras pi know we are ready to receive a drink order
    handleDrinkLED();

    WiFiClient client;
    if(client.connect("192.168.1.153", 3000)) {
        client.println("GET /api/orders/completed HTTP/1.1");
        client.println("Host: 192.168.1.10");
        client.println("Connection: close");
        client.println();
        client.stop();
        Serial.println("Completion notification sent");
    }
}

void handleDrinkLED() { //Set the four corner LEDs to on or off if we are storing an order or not
    frame[0][0] = pendingOrder ? 1 : 0;
    frame[numRows-1][0] = pendingOrder ? 1 : 0;
    frame[0][numColumns-1] = pendingOrder ? 1 : 0;
    frame[numRows-1][numColumns-1] = pendingOrder ? 1 : 0;
    matrix.renderBitmap(frame, numRows, numColumns);
}





