import signal
import sys
import datetime
import threading
import asyncio
import websockets
import time

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

# Iniciar o servidor WebSocket
server = WebSocketServer('localhost', 8769)


def run_server(loop):
    asyncio.set_event_loop(loop)

    # Iniciar o servidor WebSocket
    start_server = websockets.serve(server.handle_websocket, server.host, server.port)

    # Executar o servidor em um loop de eventos
    loop.run_until_complete(start_server)
    loop.run_forever()


def stop_server(loop):
    loop.stop()


# Criar o loop de eventos
loop = asyncio.new_event_loop()

# Iniciar o cliente WebSocket
websocket_client = WebSocketClient()
websocket_client.connect()

# Inscrever-se em vários tópicos/DEBUG
topics = [("topic1", 0), ("123456789123", 1), ("dataSet", 0)]
mqtt_communicator.subscribe_to_topics(topics)


# Função de tratamento de sinal para interromper o programa corretamente
def signal_handler(signal, frame):
    global running
    print("Programa encerrado.")
    running = False
    mqtt_communicator.disconnect()
    #server.stop_server()
    asyncio.run_coroutine_threadsafe(stop_server(loop), loop)
    sys.exit(0)


signal.signal(signal.SIGINT, signal_handler)


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
    bd_manipulator.insert_alert(value, v.topic, v.qos, datetime.datetime.now(), mac)
    bd_manipulator.disconnect()
    websocket_client.send_message(v.topic, payload_str)


# Iniciar o servidor WebSocket em uma nova thread
websocket_thread = threading.Thread(target=run_server, args=(loop,))
websocket_thread.start()

# Loop principal
while running:
    mqtt_communicator.client.loop_start()

    # Aguardar 1 segundo antes de executar novamente
    time.sleep(1)
    # insert no DB
    mqtt_communicator.client.on_message = handle_message

# Fechar o loop de eventos após sair do loop principal
loop.close()
