FROM python:3.12
WORKDIR /ft_transcendence
RUN apt update && apt install -y build-essential libpq-dev python3-dev
COPY ./ /ft_transcendence/
COPY ./certs/fullchain.pem /etc/ssl/certs/fullchain.pem
COPY ./certs/privkey.pem /etc/ssl/private/privkey.pem
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
CMD ["/ft_transcendence/wait-for-it.sh", "db:5432", "--", "daphne", "-e", "ssl:8000:privateKey=/etc/ssl/private/privkey.pem:certKey=/etc/ssl/certs/fullchain.pem", "backend.asgi:application"]