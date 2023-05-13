create database Thingsafe;
use Thingsafe;


create table dispositivo(
id int not null auto_increment,
topico varchar (255) not null,
mensagem int not null,
qos int not null,
data_hora_medicao DATETIME NOT NULL,
constraint pk_consumo primary key (id)
);


/*operações do BD

**INSERT de um topico e mensagem com um id fixo(para prova de conceito)

insert into consumo(topico,mensagem) values ('eletrodomestico',30);


**select de um id fixo para prova de conceito**


select mensagem from consumo where id= 'valor_id';

select mensagem from consumo