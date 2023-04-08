import paho.mqtt.client as mqtt
import time
import random

BROKER="test.mosquitto.org"#Também pode ser localhost. Mas caso você altere essa variável, você também precisa alterar a variável do subscriber
PORT=1883
KEEPALIVE=60
TOPIC="dataSet"
inicio_random=0#valor aleatório inicial
fim_random=30#valor aleatório limite
time_sleep_pub=1

#Publisher
client = mqtt.Client()
client.connect(BROKER, PORT, KEEPALIVE)
client.loop_start()
#time.sleep(2)  # import time
#client.loop_forever()
try:
    while True:
        msg=random.randint(inicio_random,fim_random) #para o random entrar no loop. Inicia uma função random(nativa do python)
        client.publish(TOPIC, msg)#publica a mensagem
        time.sleep(time_sleep_pub)#espera o tempo da variável time_sleep_pub, ficando sem fazer nada nesse meio tempo
except KeyboardInterrupt:
    print("\nSaindo")
    client.disconnect()
    client.loop_stop()