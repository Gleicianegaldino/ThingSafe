#include <ESP8266WiFi.h>//biblioteca do esp
#include <PubSubClient.h>//biblioteca do mqtt

//ESP8266Wifi
const char* ssid = "mamute";//nome da rede
const char* password = "kkk12345";//senha da rede

//MQTT Broker
const char* mqttServer = "test.mosquitto.org";//broker
const int mqttPort = 1883;
const char* mqttUser = "";
const char* mqttPassword = "";
const char* topic = "dataSet";//tópico

WiFiClient espClient;
PubSubClient client(espClient);

const int trigPin = 12;
const int echoPin = 14;

//define sound velocity in cm/uS
#define SOUND_VELOCITY 0.034
#define CM_TO_INCH 0.393701

long duration;
float distanceCm;
float distanceInch;

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

  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
}

void loop() {
  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echoPin, HIGH);
  
  // Calculate the distance
  distanceCm = duration * SOUND_VELOCITY/2;
  
  // Convert to inches
  distanceInch = distanceCm * CM_TO_INCH;

  int value = distanceCm;
  Serial.println(distanceCm);
  char message[1000];
  sprintf(message, "%d", value);
  client.publish(topic, message);//publica a mensagem
  delay(1000);//intervalo entre as mensagens
}


//ps: como a placa É o node MCU, é preciso instalar a placa através
//do link : http://arduino.esp8266.com/stable/package_esp8266com_index.json 
//um tutorial para download da mesma: https://www.fvml.com.br/2018/12/instalando-biblioteca-do-modulo-esp8266.html


//No meu caso foi conectado a placa na entrada usb, então atualiza essa opção quando for configurar a porta
//a placa é o nodeMCU 1.0

//precisa-se também instalar a biblioteca PubSubClient. No meu caso, eu pesquisei
//PubSubClient e instalei a do autor Cloud4RPi , que por conseguinte, instalou as dependências