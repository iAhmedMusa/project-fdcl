FROM mysql:8.0

RUN apt-get update && apt-get install -y awscli && rm -rf /var/lib/apt/lists/*

COPY docker/mysql/my.cnf /etc/mysql/conf.d/my.cnf