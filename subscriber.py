import paho.mqtt.client as mqtt
import time

#some comments are writted in portuguese. If you want to know about, you can use the google tradutor :p

HOST= "localhost"#If you want to set this parameter in a public host, is very important to you remember to choose a topic(only you use)
PORT=1883#This is a mosquitto port(when i start my broker)
keepalive=60
bind_address=""
TOPIC=[("teste",0),("teste2",0)]#tupla com tópico e QoS. Pode-se adicionar diversos tópicos e alterar o QoS caso queira

#Só para relembrar: QoS=0 significa que a entrega da mensagem será feita com o melhor esforço, sendo assim adicionada à fila do broker e não tendo a confirmação que o subscriber irá receber a mensagem. Resumindo, a mensagem não é armazenada
#QoS=1 significa que há uma garantia de que pelo menos uma vez a mensagem irá ser entregue ao receptor
#QoS=2 significa que a mensagem irá ser recebida apenas uma vez pelo receptor(é mais lento, mas mais confiável)


def on_connect(client, userdata, flags, rc):
    
    if rc == 0:
        print("Connected with result code "+str(rc))
        global Connected#Torna a variável Connected global
        Connected = True#"ativa" a variável
        
    else:
        print("Falha na conexão")


Connected = False #Variável global utilizada como referência para saber se o subscriber está conectado ao broker.

def on_message(client, userdata, msg):
    for i in range(len(TOPIC)):
        if ((msg.topic,msg.qos)==TOPIC[i]):#comparação do tópico(tupla de tópico e Qos) da mensagem com o tópico(tupla) da variável TOPIC
            with open(f'{TOPIC[i]}.csv','at') as f:#instanciou a variavel f para abrir/criar o arquivo com o nome do tópico(ou qualquer outro que tenha alterado)
                f.write(f'{str(msg.payload)}\n') 
                f.close() 
        
        
    
    print("=============================")
    print("Topic: "+msg.topic)
    print("Payload: "+str(msg.payload))
    print("=============================")

    

    


#message='teste' this line is unnused
client = mqtt.Client("python3")
client.on_connect = on_connect
client.on_message = on_message

client.connect(HOST, PORT, keepalive,bind_address)

client.loop_start()
while Connected != True:
    time.sleep(1)#time to wait a start a connection

try:
    while True:
        time.sleep(1)
        client.subscribe(TOPIC)

except KeyboardInterrupt:
    print('\nSaindo')
    client.disconnect()
    client.loop_stop