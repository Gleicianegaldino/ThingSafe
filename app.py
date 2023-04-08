from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import json
import paho.mqtt.client as mqtt
import os

BROKER = "test.mosquitto.org"
PORT = 1883
KEEPALIVE = 60
TOPIC = [("dataSet", 0)]    

dir_atual = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# Inicializando lista vazia
data = []

# Função para adicionar mensagens recebidas na lista de dados
def on_message(client, userdata, msg):
    data.append({
        "mensagem": str(msg.payload),
        "topico": str(msg.topic),
        "qos": str(msg.qos),
    })

@app.route('/')
def index():
    for topic in TOPIC:
        with open(os.path.join(dir_atual, f'{topic[0]}.json'), 'r') as f:
            for line in f:
                data.append(json.loads(line))
    return render_template('index.html', data=data)

@socketio.on('request_data')
def send_data():
    json_data = []
    for topic in TOPIC:
        with open(os.path.join(dir_atual, f'{topic[0]}.json'), 'r') as f:
            for line in f:
                json_data.append = json.loads(line)
    emit('data', json_data)


if __name__ == '__main__':
    # Configuração do cliente MQTT
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(BROKER, PORT, KEEPALIVE)
    client.subscribe(TOPIC)

    # Inicialização do SocketIO
    socketio.run(app, debug=True)
