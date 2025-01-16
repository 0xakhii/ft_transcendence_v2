FROM node:18-alpine

RUN apk update && apk upgrade \
	&& apk add curl\
	&& apk add nodejs-current npm\
	&& npm cache clean --force && rm -rf /usr/local/lib/node_modules/\
	&& mkdir -p /ft_transcendence/srcs/

COPY ./ /ft_transcendence/srcs/
WORKDIR /ft_transcendence/srcs

RUN chmod +x /ft_transcendence/srcs/conf.sh
EXPOSE 5173

ENTRYPOINT [ "/bin/sh", "/ft_transcendence/srcs/conf.sh" ]