FROM registry.njuics.cn/library/nginx:latest

ADD ./build /usr/share/nginx/html

ADD ./nginx.conf /etc/nginx/nginx.conf