#!/bin/bash

# Inicia o serviço do MySQL
service mysql start

# Espera até que o MySQL esteja pronto
while ! mysqladmin ping -h"localhost" --silent; do
  sleep 1
done

# Verifica se o banco de dados Thingsafe já existe
if ! mysql -u root -p -e "use Thingsafe"; then
  # Cria o banco de dados
  mysql -u root -p"yourpassword" -e "CREATE DATABASE Thingsafe"
fi

# Executa as migrações do Laravel
php artisan migrate

# Inicia o servidor Apache
apache2-foreground
