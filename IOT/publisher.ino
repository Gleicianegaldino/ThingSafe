#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include <espnow.h>
#include <user_interface.h>

// ESP8266Wifi
const char* ssid = "";        // network name
const char* password = "";  // password

// MQTT broker
const char* mqttServer = "test.mosquitto.org";
const int mqttPort = 1883;
const char* mqttUser = "";
const char* mqttPassword = "";
const char* topicIdDevice = "dataSet";  // topic

WiFiClient espClient;
PubSubClient client(espClient);

// sensor pin
const int trigPin = 12;
const int echoPin = 14;

// sound velocity in cm/uS
#define SOUND_VELOCITY 0.034


#define LED D0  //Led in NodeMCU at pin GPIO16 (D0)

const int buzzer = 15;  // D8

// distance
float distanceCm;
float averageDistance;

// button
const int buttonPin = 13;  // D7
int buttonState = 0;

// calibration
bool start = false;

// calculate average distance
const int bufferLength = 10;
float distances[bufferLength];
int bufferIndex = 0;

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  client.setServer(mqttServer, mqttPort);
  while (!client.connect("NodeMCU", mqttUser, mqttPassword)) {
    Serial.println("Connecting to MQTT...");
    delay(500);
  }
  Serial.println("Connected to MQTT");

  pinMode(trigPin, OUTPUT);  // sets the trigPin as an Output
  pinMode(echoPin, INPUT);   // sets the echoPin as an Input
  pinMode(buzzer, OUTPUT);

  // button
  pinMode(buttonPin, INPUT);

  start = false;
  pinMode(LED, OUTPUT);  //LED pin as output
  digitalWrite(LED, HIGH);
}

void calculateDistance() {
  // clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // reads the echoPin, returns the sound wave travel time in microseconds
  long duration = pulseIn(echoPin, HIGH);

  // calculate the distance
  distanceCm = duration * SOUND_VELOCITY / 2;

  // Atualiza o valor do array distances com a distância capturada
  distances[bufferIndex] = distanceCm;
  bufferIndex = (bufferIndex + 1) % bufferLength;
}

void calculateAverageDistance() {
  float sum = 0;

  for (int i = 0; i < bufferLength; i++) {
    sum += distances[i];
  }

  averageDistance = sum / bufferLength;
}

bool checkPerimeterBreak(float distanceCm, float averageDistance) {
  if (abs(distanceCm - averageDistance) > 6) {
    return true;
  }
  return false;
}

void sirenTurnOn() {
  unsigned long initialTime = millis();

  while (true) {
    // Serial.println("Zig-Zig");

    tone(buzzer, 1500);
    delay(500);
    noTone(buzzer);
    delay(500);

    unsigned long currentTime = millis();
    unsigned long elapsedTime = currentTime - initialTime;

    if (elapsedTime >= 5000) {
      break;
    }
  }
}

void buttonAlert() {
  buttonState = digitalRead(buttonPin);

  // checking if the button was pressed
  if (buttonState == LOW) {
    start = !start;
    Serial.println("button pressed");
  }
}

void loop() {
  calculateDistance();
  delay(1000);
  calculateAverageDistance();

  Serial.print("distanceCm: ");
  Serial.println(distanceCm);
  Serial.print("averageDistance: ");
  Serial.println(averageDistance);
  Serial.print("\n");

  Serial.println(start);
  buttonAlert();

  Serial.println(checkPerimeterBreak(distanceCm, averageDistance));
  Serial.print("\n");

  if (checkPerimeterBreak(distanceCm, averageDistance) && start) {
    // publish
    String macAddress = WiFi.macAddress();

    Serial.print("mac: ");
    Serial.println(macAddress);
    char message[1000];
    // 1 = true
    int value = 1;

    snprintf(message, sizeof(message), "%02X:%02X:%02X:%02X:%02X:%02X; ALERT/ %d",
             macAddress[0], macAddress[1], macAddress[2], macAddress[3], macAddress[4], macAddress[5], value);
    client.publish(topicIdDevice, message);
    sirenTurnOn();
    start = false;
  }
}
