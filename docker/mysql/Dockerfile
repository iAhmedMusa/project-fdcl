FROM mysql:8.0

RUN microdnf install -y awscli && microdnf clean all

COPY docker/mysql/my.cnf /etc/mysql/conf.d/my.cnf

COPY docker/mysql/backup.sh /usr/local/bin/backup.sh
RUN chmod +x /usr/local/bin/backup.sh