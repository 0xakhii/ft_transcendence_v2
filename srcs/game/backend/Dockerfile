FROM python:3.12

WORKDIR /ft_transcendence

RUN apt update && apt install -y \
    build-essential \
    libpq-dev \
    python3-dev

COPY ./ /ft_transcendence/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
CMD  ["/ft_transcendence/wait-for-it.sh", "db:5432", "--", "daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]