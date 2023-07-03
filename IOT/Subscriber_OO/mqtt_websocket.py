import threading
import json
import datetime
import websocket


# Variáveis do WebSocket
WEBSOCKET_SERVER = "ws://localhost:8769/" #valor padrao que eu defini


class WebSocketClient:
    def __init__(self):
        self.websocket = None

    def connect(self):
        self.websocket = websocket.WebSocketApp(WEBSOCKET_SERVER, on_message=self.on_message)
        websocket_thread = threading.Thread(target=self.websocket.run_forever)
        websocket_thread.daemon = True
        websocket_thread.start()

    def send_message(self, topic, payload):
        if self.websocket and self.websocket.sock and self.websocket.sock.connected:
            message = {
                'topic': topic,
                'payload': payload
            }
            self.websocket.send(json.dumps(message))

    def on_message(self, ws, message):
        data = json.loads(message)
        topic = data['topic']
        payload = data['payload']
        # mqtt_client.publish(topic, payload)
