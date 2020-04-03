FROM node:latest

WORKDIR /app
COPY . .
# 如果在gihub,gitlab上进行镜像部署就打开如下注释
# RUN npm config set registry https://registry.npm.taobao.org/
# RUN npm install --production
EXPOSE 7002
CMD ["npm","start"]
