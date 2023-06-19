import paho.mqtt.client as mqtt
import time
import json
import pymysql
import datetime
import os
import signal
import sys
import re

from bd_manipulator import BDManipulator
from json_manipulator import JSONManipulator
from mqtt_communicator import MQTTCommunicator

# Variáveis de controle do MQTT
BROKER = "test.mosquitto.org"
PORT = 1883
KEEPALIVE = 60
BIND = ""

# Instanciar objetos
bd_manipulator = BDManipulator("localhost", "root", "root", "thingsafe", 3307)
json_manipulator = JSONManipulator()
mqtt_communicator = MQTTCommunicator(BROKER, PORT, KEEPALIVE, BIND)

# Conectar ao banco de dados
bd_manipulator.connect()

# Conectar ao MQTT broker
mqtt_communicator.connect()

# Inscrever-se em vários tópicos/DEBUG
topics = [("topic1", 0), ("123456789123", 1), ("dataSet", 0)]
mqtt_communicator.subscribe_to_topics(topics)

# Função de tratamento de sinal para interromper o programa corretamente
def signal_handler(signal, frame):
    print("Programa encerrado.")
    bd_manipulator.disconnect()
    mqtt_communicator.disconnect()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

# Loop principal
while True:
    mqtt_communicator.client.loop_start()
    
    # Sobrecarga de método
    def handle_message(client, userdata, v):
        payload_str = v.payload.decode()
        mensagem = str(v.payload)
        mac = mensagem.split(" ;")[0]
        value = mensagem.split(" ;")[1]

        print("=============================")
        print("Topic: " + str(v.topic))
        print("Payload: " + str(v.payload))
        print("Mac: " + str(mac))
        print("value: " + value)
        print("Hora: " + datetime.datetime.now(datetime.timezone.utc).strftime("%H:%M:%S"))

        
        
        
        
        

        # Insert into the database
        
        
        #print("Invalid payload format")

            # bd_manipulator.execute_query("INSERT INTO smart_cone (mac) VALUES (%s)", (mac,))

    # Aguardar 1 segundo antes de executar novamente
    time.sleep(1)
    # insert no DB
    mqtt_communicator.client.on_message = handle_message
