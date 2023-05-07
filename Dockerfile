FROM php:8.1-apache

# Atualize os pacotes do sistema
RUN apt-get update

# Instale as dependências do PHP
RUN apt-get install -y zip unzip libzip-dev
RUN docker-php-ext-install zip pdo_mysql mysqli

# Atualize as configurações do Apache
COPY .docker/vhost.conf /etc/apache2/sites-available/000-default.conf
RUN a2enmod rewrite

# Copie o código-fonte do Laravel para o contêiner
COPY . /var/www/html

# Configure as permissões
RUN chown -R www-data:www-data /var/www/html/storage
RUN chown -R www-data:www-data /var/www/html/bootstrap/cache

# Copie o script para o diretório /usr/local/bin e dê permissão de execução
COPY .docker/entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entrypoint.sh

# Defina o ponto de entrada do contêiner
ENTRYPOINT ["entrypoint.sh"]
# Instalar o composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer


# Instalar o VS Code
RUN curl -sSL https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
RUN echo "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main" > /etc/apt/sources.list.d/vscode.list
RUN apt-get update
RUN apt-get install -y code


# Instalar o Laravel
RUN composer global require laravel/installer


