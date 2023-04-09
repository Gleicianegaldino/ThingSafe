import threading
import paho.mqtt.client as mqtt 
import time 
import json
import sys
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import paho.mqtt.client as mqtt
import os
 
HOST= "test.mosquitto.org"
PORT = 1883
keepalive=60 
bind_address=""
TOPIC = [("dataSet", 0)]    

dir_atual = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

data = {"data": []}

def on_connect(client, userdata, flags, rc):     
    if rc == 0: 
        print("Connected with result code "+str(rc)) 
        global Connected
        Connected = True    
    else: 
        print("Falha na conexão") 
Connected = False

def on_message(client, userdata, msg):
    for i in range(len(TOPIC)):
        if ((msg.topic,msg.qos)==TOPIC[i]):
            # Adicione cada mensagem recebida ao objeto 'data'
            message = {
                # "mensagem": str(msg.payload),
                "messagem": str(msg.payload),
                "topico": str(msg.topic),
                "qos": str(msg.qos),
            }
            # message = json.loads(msg.payload.decode("utf-8").replace("'", '"'))
            data["data"].append(message)

    with open(f"dataSet.json", "w") as f:
        # Escreva o objeto inteiro no arquivo
        json.dump(data, f, indent=2)
        f.write('\n')

    print("Topic: "+str(msg.topic))
    print("Payload: "+str(msg.payload))

@app.route('/')
def index():
    for topic in TOPIC:
        with open(os.path.join(dir_atual, f'{topic[0]}.json'), 'r') as f:
            for line in f:
                # json_data = json.loads(line)
                # data.append(json_data)
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

def mqtt_loop():
    #message='teste' this line is unnused 
    client = mqtt.Client("python3") 
    client.on_connect = on_connect 
    client.on_message = on_message 
    
    client.connect(HOST, PORT, keepalive,bind_address) 
    
    client.loop_start() 
    while Connected != True: 
        time.sleep(1)
    
    try: 
        while True: 
            time.sleep(1) 
            client.subscribe(TOPIC) 
    
    except KeyboardInterrupt: 
        print('\nSaindo') 
        client.disconnect() 
        client.loop_stop 

# Inicialização do SocketIO
if __name__ == '__main__':
    mqtt_thread = threading.Thread(target=mqtt_loop)
    mqtt_thread.start()

    socketio.run(app, debug=True)
