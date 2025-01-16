FROM node:18-alpine

RUN apk update && apk upgrade \
	&& apk add curl\
	&& apk add nodejs-current npm\
	&& npm cache clean --force && rm -rf /usr/local/lib/node_modules/\
	&& mkdir /ft_transcendence/

COPY ./ /ft_transcendence/
WORKDIR /ft_transcendence/

RUN chmod +x /ft_transcendence/conf.sh
EXPOSE 5173

ENTRYPOINT [ "/bin/sh", "/ft_transcendence/conf.sh" ]