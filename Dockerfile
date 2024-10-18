FROM node:20-alpine AS build

WORKDIR /client

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]