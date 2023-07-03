import signal
import sys
import datetime
import threading
import asyncio

import paho.mqtt.client as mqtt

from bd_manipulator import BDManipulator
from json_manipulator import JSONManipulator
from mqtt_communicator import MQTTCommunicator
from mqtt_websocket import WebSocketClient
from websocket_server import WebSocketServer


# Variáveis de controle do MQTT
BROKER = "test.mosquitto.org"
PORT = 1883
KEEPALIVE = 60
BIND = ""

# Variável para controlar a execução das threads
running = True

# Instanciar objetos
bd_manipulator = BDManipulator("localhost", "root", "root", "thingsafe", 3306)
json_manipulator = JSONManipulator()
mqtt_communicator = MQTTCommunicator(BROKER, PORT, KEEPALIVE, BIND)

# Conectar ao banco de dados
bd_manipulator.connect()

# Conectar ao MQTT broker
mqtt_communicator.connect()

# Inicio e execução do servidor do websocket
server = WebSocketServer('localhost', 8769)


async def run_server():
    # Executar o servidor WebSocket
    await server.run_server()


websocket_thread = threading.Thread(target=lambda: asyncio.run(run_server()))
websocket_thread.start()

# Inscrever-se em vários tópicos/DEBUG
topics = [("topic1", 0), ("123456789123", 1), ("dataSet", 0)]
mqtt_communicator.subscribe_to_topics(topics)


# Função de tratamento de sinal para interromper o programa corretamente
def signal_handler(signal, frame):
    global running
    print("Programa encerrado.")
    running = False
    bd_manipulator.disconnect()
    mqtt_communicator.disconnect()
    server.stop_server()
    sys.exit(0)


signal.signal(signal.SIGINT, signal_handler)


# Iniciar o cliente WebSocket
websocket_client = WebSocketClient()
websocket_client.connect()

# Sobrecarga de método
def handle_message(client, userdata, v):
    payload_str = v.payload.decode()
    mensagem = str(v.payload)
    mac = str(mensagem.split(" ;")[0].strip().replace("'", ""))
    value = int(mensagem.split(" ;")[1].strip().replace("'", ""))

    print("=============================")
    print("Topic: " + str(v.topic))
    print("Payload: " + str(v.payload))
    print("Mac: " + str(mac))
    print("value: " + str(value))
    print(
        "Hora: " + datetime.datetime.now(datetime.timezone.utc).strftime("%H:%M:%S")
    )

    bd_manipulator.connect()
    # smart_cone_id = bd_manipulator.insert_smart_cone(mac)
    # bd_manipulator.insert_alert(value, v.topic, v.qos, datetime.datetime.now(), smart_cone_id)
    bd_manipulator.disconnect()
    websocket_client.send_message(v.topic, payload_str)


# Loop principal
while running:
    mqtt_communicator.client.loop_start()

    # Esperar eventos assíncronos por 1 segundo
    loop = asyncio.get_event_loop()
    loop.run_until_complete(asyncio.sleep(1))
    # insert no DB
    mqtt_communicator.client.on_message = handle_message
