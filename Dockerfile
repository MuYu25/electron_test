FROM alibaba-cloud-linux-3-registry.cn-hangzhou.cr.aliyuncs.com/alinux3/node:16.17.1-nslt
# FROM alibaba-cloud-linux-3-registry.cn-hangzhou.cr.aliyuncs.com/alinux3/alinux3:latest     

WORKDIR /app

# RUN apt-get update && apt-get install node
USER root
RUN npm --version
COPY package.json .
RUN npm config set -g registry http://registry.npm.taobao.org
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
