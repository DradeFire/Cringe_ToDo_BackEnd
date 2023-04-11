#build TS -> JS
FROM node:16.18.1-alpine AS build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

# Установка зависимостей
RUN yarn install --frozen-lockfile

# Копируем 
COPY tsconfig.json ./
COPY webpack.config.js ./
COPY src ./src

# Сборка проекта
RUN yarn build:webpack

#####################
#Подготовка к запуску
FROM node:16.18.1-alpine AS deploy

WORKDIR /app

RUN apk add --no-cache bash \
  && yarn add global dotenv

COPY swagger-ui-dist ./swagger-ui-dist

COPY --from=build ./app/dist ./dist

#Команда для запуска сервера внутри контейнера
CMD [ "node", "-r", "dotenv/config", "dist/index.js" ]