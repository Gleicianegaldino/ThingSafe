from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import json
import paho.mqtt.client as mqtt
import os

HOST= "test.mosquitto.org"
PORT = 1883
keepalive=60 
bind_address=""
TOPIC ="dataSet"  

dir_atual = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# Inicializando lista vazia
data = []

# Função para adicionar mensagens recebidas na lista de dados
def on_message(client, userdata, msg):
    for i in range(len(TOPIC)): 
        if ((msg.topic,msg.qos)==TOPIC): 
            with open(f'dataSet.json','at') as f:
                message = {
                    "mensagem": str(msg.payload),
                    "topico": str(msg.topic),
                    "qos": str(msg.qos),
                }

                json.dump(message, f, indent=2)
                f.write('\n')
                          
    print("Topic: "+str(msg.topic) )
    print("Payload: "+str(msg.payload)) 

@app.route('/')
def index():
    for topic in TOPIC:
        with open(os.path.join(dir_atual, f'{topic}.json'), 'r') as f:
            for line in f:
                data.append(json.loads(line))
    return render_template('index.html', data=data)

@socketio.on('request_data')
def send_data():
    json_data = []
    for topic in TOPIC:
        with open(os.path.join(dir_atual, f'{topic}.json'), 'r') as f:
            for line in f:
                json_data.append = json.loads(line)
    emit('data', json_data)


if __name__ == '__main__':
    # Configuração do cliente MQTT
    client = mqtt.Client()
    client.on_message = on_message
    client.connect(HOST, PORT, keepalive, bind_address)
    client.subscribe(TOPIC)

    # Inicialização do SocketIO
    socketio.run(app, debug=True)
