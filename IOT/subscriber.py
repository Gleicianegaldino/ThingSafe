import paho.mqtt.client as mqtt 
import time 
import json
import pymysql
import datetime
import os
import signal
import sys




#A tabela do BD está no diretório BD no arquivo api_Energy_monitor.sql

#COnfigurações do Banco
host_banco="localhost"
user_banco="root"
passwd_banco="root"
db_nome_banco="thingsafe"
porta_banco = 3306
tempo_espera_insert=1#provavelmente não será usado nesse código pois o insert será feito a cada iteração com o broker

tempo_verificacao_topicos_n_publicados=1

operacao_insert= "INSERT INTO Dispositivo(mensagem,topico,qos,data_hora_medicao) VALUES(%s, %s, %s,%s)"#Não altere muito aqui, mas se alterar, verifique o laço for com os dados do json

  
#some comments are writted in portuguese. If you want to know about, you can use the google tradutor :p 
 
HOST= "test.mosquitto.org"#If you want to set this parameter in a public host, is very important to you remember to choose a topic(only you use) 
PORT=1883#This is a mosquitto port(when i start my broker) 
keepalive=60 
bind_address="" 
TOPIC=[("dataSet",0),("microondas",0)]#tupla com tópico e QoS. Pode-se adicionar diversos tópicos e alterar o QoS caso queira 


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





#Conexão com o banco
#A conexão está sendo feita fora da funçao para poder ser tratada no trycatch do final do código
conexao = pymysql.connect(host=host_banco,port=porta_banco, user=user_banco, passwd=passwd_banco, db=db_nome_banco)
cursor = conexao.cursor() #cursor agora é uma variável global







#=====================================================


# Função para lidar com o sinal de interrupção (Ctrl+C)
def handle_interrupt(signal, frame):
    print("Encerrando...")
    desligar_status_dispositivos()
    sys.exit(0)

# Associar o sinal de interrupção (Ctrl+C) ao manipulador de sinal
signal.signal(signal.SIGINT, handle_interrupt)

# Função para desligar o status de todos os dispositivos
def desligar_status_dispositivos():
    for topico in status_counts:
        status_sensor_json_banco(topico, "fora", False)
        





#=================================================================================================       
#O contador de status verifica se o dispositivo possui mais de 10 mensagens com o valor 0        

status_counts = {}

# Função para atualizar o contador de status e reiniciá-lo quando necessário
def atualizar_contador_status(topico, mensagem):
    # Verificar se o tópico já está no dicionário de contadores de status
    if topico in status_counts:
        # O tópico já existe no dicionário, obter o contador correspondente
        status_count = status_counts[topico]
    else:
        # O tópico não existe no dicionário, criar um novo contador e adicioná-lo ao dicionário
        status_count = 0
        status_counts[topico] = status_count

    # Verificar se a mensagem é 0
    if mensagem == 0:
        # Atualizar o contador de status para o tópico correspondente
        status_count += 1
        # Verificar se o contador atingiu o valor 10
        if status_count == 10:
            # Chamar a função para reiniciar o contador
            reiniciar_contador_status(topico)
            # Chamar a função para inserir o status no banco de dados
            status_sensor_json_banco(topico, "fora", False)
    else:
        # Resetar o contador se a mensagem for diferente de 0
        status_count = 0

    # Atualizar o contador de status no dicionário
    status_counts[topico] = status_count

# Função para reiniciar o contador de status
def reiniciar_contador_status(topico):
    status_counts[topico] = 0

#==========================================================================================================




#SE A FUNÇÃO FOR CHAMADA FORA DO ESCOPO IRÁ RETORNAR FALSE(DISPOSITIVO DESATIVADO) --> A função ainda não foi bem produzida
def status_sensor_json_banco(DISPOSITIVO_TOPICO, DENTRO_OU_FORA_DA_FUNCAO, EH_JSON):
    # Verificar se o campo DENTRO_OU_FORA_DA_FUNCAO está vazio
    if DENTRO_OU_FORA_DA_FUNCAO.lower() == "fora":
        status = 0
    else:
        # Converter o valor para BIT
        status = 1 if DENTRO_OU_FORA_DA_FUNCAO.lower() == "dentro" else 0

    # Verificar se o registro já existe
    select_query = "SELECT * FROM status WHERE DISPOSITIVO_TOPICO = %s"
    cursor.execute(select_query, (DISPOSITIVO_TOPICO,))
    existing_record = cursor.fetchone()

    if existing_record is None:
        # O registro não existe, realizar a inserção
        insert_query = "INSERT INTO status(status_sensor, DISPOSITIVO_TOPICO) VALUES (%s, %s)"
        cursor.execute(insert_query, (status, DISPOSITIVO_TOPICO))
    else:
        # O registro já existe, realizar o update
        update_query = "UPDATE status SET status_sensor = %s WHERE DISPOSITIVO_TOPICO = %s"
        cursor.execute(update_query, (status, DISPOSITIVO_TOPICO))

    conexao.commit()
    
    
    
    
ultima_publicacao = {}


#=============================================================


def JSON_status_desativado(dados, nome_arquivo):
    
    nome_arquivo = f'{nome_arquivo}.json'
    
    dados_atualizados = {
    "Dispositivos_desligados": dados
    }
    # Verificar se o arquivo existe
    if not os.path.exists(nome_arquivo):
        # Criar o arquivo se não existir
        with open(nome_arquivo, 'w') as arquivo:
            json.dump({}, arquivo)

    # Ler o arquivo JSON existente
    with open(nome_arquivo, 'r') as arquivo:
        dados_antigos = json.load(arquivo)

    # Atualizar os dados com os dados fornecidos
    dados_antigos.update(dados_atualizados)

    # Reescrever o arquivo com os dados atualizados
    with open(nome_arquivo, 'w') as arquivo:
        json.dump(dados_antigos, arquivo)

    print(f"Arquivo {nome_arquivo} atualizado com sucesso.")



    




#=================================================================
#função de atualização dos status
def imprimir_topicos_inativos():
    horario_atual = time.time()
    topicos_inativos = []

    for topico in TOPIC:
        ultima_publicacao_topico = ultima_publicacao.get(topico[0])
        if ultima_publicacao_topico is None or horario_atual - ultima_publicacao_topico > tempo_verificacao_topicos_n_publicados:
            topicos_inativos.append(topico[0])

    if len(topicos_inativos) > 0:
        print(f"Tópicos inativos nos últimos {tempo_verificacao_topicos_n_publicados} segundos:")
        for topico in topicos_inativos:
            print(topico)
            status_sensor_json_banco(str(topico),"fora",False)
            #Aqui eu posso enviar os dados em JSON para qualquer Host contendo uma atualização
            JSON_status_desativado(topicos_inativos, "Dispositivos_desativados")
            
    else:
        print(f"Nenhum tópico inativo nos últimos {tempo_verificacao_topicos_n_publicados} segundos")
        
        

#Função de atualização dos status
def on_message(client, userdata, msg):
    
    ultima_publicacao[msg.topic] = time.time()
    
    print("=============================") 
    print("Topic: "+str(msg.topic) )
    print("Payload: "+str(msg.payload)) 
    print("Hora:"+datetime.datetime.now(datetime.timezone.utc).strftime("%H:%M:%S"))
    print("=============================") 
    
    
    
    for i in range(len(TOPIC)):
        if((msg.topic,msg.qos)==TOPIC[i]):
            now = datetime.datetime.now() #variavel que guarda o horario atual
            mensagem={  
                'mensagem': int(msg.payload),
                'topico': str(msg.topic),
                'qos': str(msg.qos),#Caso queira salvar como um inteiro você digita: 
                'horario':now.isoformat(),#guarda o horario no json
                'status': 1
                };
            
            
            
            #transformando o tipo dos dados e guardando em outras variáveis
            mensagemBanco= int(msg.payload)
            topicoBanco= str(msg.topic)
            qosBanco= str(msg.qos)
            horario_formatado=datetime.datetime.now(datetime.timezone.utc)#formata o horario para esse formato para inserir no BD
            
            
            # Atualizar o contador de status
            atualizar_contador_status(topicoBanco, mensagemBanco)
            
            status_sensor_json_banco(str(msg.topic),"Dentro",False)
            
            
            #insert no BD
            cursor.execute(operacao_insert,(mensagemBanco,topicoBanco,qosBanco,horario_formatado))
            
            #confirmar a inserção
            conexao.commit()
            
            
           # with open(f'../FRONT/grafico/src/public{msg.topic}.json','w') as f:
            #    pass
            #with open(f'../FRONT/grafico/src/public{msg.topic}.json','r') as f:
             #   conteudo_json=f.read()
              #  if not conteudo_json:
               #     with open(f'../FRONT/grafico/src/public{msg.topic}.json','w') as s:
                #        json.dump([],s)
            #with open(f'../FRONT/grafico/src/public{msg.topic}.json','r') as f:
             #   guardando_json=json.load(f)
                
            #guardando_json.append(mensagem)
            #with open(f'../FRONT/grafico/src/public{msg.topic}.json','w') as f:
             #   json.dump(guardando_json,f)
            json_temporario=[mensagem]
            nome_do_arquivo=f'./{msg.topic}.json'
            def criacao_arquivo_se_nao_existe(nome_do_arquivo,mensagem):
                if os.path.exists(nome_do_arquivo):
                    with open(nome_do_arquivo,'r') as f:
                        arquivo = json.load(f)
                        arquivo.append(mensagem)
                else:
                    arquivo = []
                    arquivo.extend(mensagem)
                    
                       
                with open(nome_do_arquivo,'w') as arquivos_json:
                    json.dump(arquivo,arquivos_json,indent=4)
            criacao_arquivo_se_nao_existe(nome_do_arquivo,mensagem) 
            
             #saber se o a mensagem foi 0 
             #atualizar_contador_status(str(msg.topic), str(msg.payload))        
    
                   
            
    # Verificar quais tópicos não foram processados
        else:
            pass
            #atualizar_contador_status(str(msg.topic), str(msg.payload))

            
             









  




      

  
      
  
      
  
  

client = mqtt.Client("python3") 
client.on_connect = on_connect 
client.on_message = on_message 
  
client.connect(HOST, PORT, keepalive,bind_address) 
  
client.loop_start()

# Lista para armazenar os tópicos subscritos
topicos_subscritos = []

# Função para verificar e atualizar a lista de tópicos subscritos
def verificar_atualizar_subscricoes():
    topicos_nao_subscritos = []

    # Verificar cada tópico da lista TOPIC
    for topico in TOPIC:
        # Verificar se o tópico não está na lista de tópicos subscritos
        if topico not in topicos_subscritos:
            topicos_nao_subscritos.append(topico)

    # Subscrever os tópicos não subscritos e atualizar a lista de tópicos subscritos
    for topico in topicos_nao_subscritos:
        client.subscribe(topico)
        topicos_subscritos.append(topico)

# Chamada inicial para verificar e atualizar as subcrições
verificar_atualizar_subscricoes()

while Connected != True: 
    time.sleep(1)#time to wait a start a connection 
  
try: 
    while True: 
        time.sleep(1) 
        verificar_atualizar_subscricoes()
        imprimir_topicos_inativos()
       
        
        
        
  
except KeyboardInterrupt: 
    print('\nSaindo') 
    conexao.close()#fecha a conexão
    print("\nConexão com o banco encerrada e programa fechado com sucesso\n")
    client.disconnect() 
    client.loop_stop 
    
    