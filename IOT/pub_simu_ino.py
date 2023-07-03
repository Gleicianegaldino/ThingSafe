import paho.mqtt.client as mqtt
import time
import datetime
import json
import random

# Variáveis de controle do MQTT
BROKER = "test.mosquitto.org"
PORT = 1883
KEEPALIVE = 60

# Cria um cliente MQTT
client = mqtt.Client()

# Conecta ao broker MQTT
client.connect(BROKER, PORT, KEEPALIVE)

# Função para publicar um dado fictício
def publish_fake_data():
    mac_address = "00:11:22:33:44:55"  # Endereço MAC fictício
    value = random.randint(0, 1)  # Valor aleatório (0 ou 1)

    message = "{} ; {}".format(mac_address, value)

    # Publica o dado no tópico desejado
    result, _ = client.publish("topic1", message)

    if result == mqtt.MQTT_ERR_SUCCESS:
        print("Message published successfully")
    else:
        print("Failed to publish message")

# Loop principal
while True:
    publish_fake_data()
    time.sleep(1)
