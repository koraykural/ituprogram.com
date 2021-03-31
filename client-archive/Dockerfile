# Step 1
FROM node:12-alpine as build-step
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
COPY . /usr/src/app
RUN npm run build

# Step 2
FROM nginx:1.17.1-alpine
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-step /usr/src/app/dist /usr/share/nginx/html
