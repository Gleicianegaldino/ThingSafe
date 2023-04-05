from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import json

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

# Função que é chamada quando a página é carregada
@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('request_data')
def send_data():
    with open(('teste', 0).json) as f:
        json_data = json.load(f)
    emit('data', json_data)


if __name__ == '__main__':
    # Configuração do cliente MQTT
    client = mqtt.Client()
    client.on_message = on_message
    client.connect('localhost', 1883)
    client.subscribe('teste')

    # Inicialização do SocketIO
    socketio.run(app)
