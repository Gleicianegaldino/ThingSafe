const WebSocket = require('ws');

const WebSocketServer = 'ws://localhost:8769/';
const socket = new WebSocket(WebSocketServer);

socket.on('open', function () {
  console.log('WebSocket connected');
});

socket.on('message', function (data) {
  const message = JSON.parse(data);
  const topic = message.topic;
  const payload = message.payload;
  console.log(`Received message - Topic: ${topic}, Payload: ${payload}`);

  // Envie os dados recebidos para o servidor WebSocket aqui
  // Exemplo:
  // sendToServer(topic, payload);
});

socket.on('close', function () {
  console.log('WebSocket disconnected');
});

// Função para enviar mensagens para o servidor WebSocket
function sendToServer(topic, payload) {
  if (socket.readyState === WebSocket.OPEN) {
    const message = {
      topic: topic,
      payload: payload
    };
    socket.send(JSON.stringify(message));
  }
}
