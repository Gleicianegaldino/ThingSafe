#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#include <espnow.h>
#include <user_interface.h>

// ESP8266Wifi
const char* ssid = "";
const char* password = "";

// MQTT broker
const char* mqttServer = "test.mosquitto.org";
const int mqttPort = 1883;
const char* mqttUser = "";
const char* mqttPassword = "";
const char* topicIdDevice = "dataSet";

WiFiClient espClient;
PubSubClient client(espClient);

// sensor pin
const int trigPin = 12;
const int echoPin = 14;

// sound velocity in cm/uS
#define SOUND_VELOCITY 0.034

const int buzzer = 15;  // D8

// distance
float distanceCm;
float averageDistance;

// button
const int buttonPin = 13;  // D7
int buttonState = 0;

// calculate average distance
const int bufferLength = 10;
float distances[bufferLength];
int bufferIndex = 0;

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  client.setServer(mqttServer, mqttPort);
  while (!client.connect("NodeMCU", mqttUser, mqttPassword)) {
    Serial.println("Connecting to MQTT...");
    delay(300);
  }
  Serial.println("Connected to MQTT");

  pinMode(trigPin, OUTPUT);  // sets the trigPin as an Output
  pinMode(echoPin, INPUT);   // sets the echoPin as an Input
  pinMode(buzzer, OUTPUT);

  // button
  pinMode(buttonPin, INPUT);
}

void calculateDistance() {
  // clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  distanceCm = duration * SOUND_VELOCITY / 2;
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
    tone(buzzer, 1500);
    delay(300);
    noTone(buzzer);
    delay(300);

    unsigned long currentTime = millis();
    unsigned long elapsedTime = currentTime - initialTime;

    if (elapsedTime >= 5000) {
      break;
    }
  }
}

void buttonAlert() {
  buttonState = digitalRead(buttonPin);
  Serial.println(buttonState);
}

void debug() {
  Serial.print("distanceCm: ");
  Serial.println(distanceCm);
  Serial.print("averageDistance: ");
  Serial.println(averageDistance);
  Serial.print("buttonAlert: ");
  buttonAlert();
  Serial.print("checkPerimeterBreak: ");
  Serial.println(checkPerimeterBreak(distanceCm, averageDistance));
  Serial.print("\n");
}

void loop() {
  calculateDistance();
  calculateAverageDistance();
  debug();

  if (checkPerimeterBreak(distanceCm, averageDistance)) {
    if (!buttonState) {
      // publish
      String macAddress = WiFi.macAddress();
      char macAddressArray[18];
      sprintf(macAddressArray, "%02X:%02X:%02X:%02X:%02X:%02X",
              macAddress[0], macAddress[1], macAddress[2], macAddress[3], macAddress[4], macAddress[5]);
      char message[1000];
      // 1 = true
      int value = 1;

      snprintf(message, sizeof(message), "%s ; %d", macAddressArray, value);

      if (client.publish(topicIdDevice, message)) {
        Serial.println("Message published successfully");
      } else {
        Serial.println("Failed to publish message");
      }
      sirenTurnOn();
    }
  }
  delay(1000);
}
