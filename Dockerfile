# Build Stage
FROM node:18-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# 빌드 시점에 환경 변수 주입 (VITE_API_URL 등)
# 실제 값은 docker build --build-arg 로 전달받거나 .env 파일을 활용
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production Stage
FROM nginx:stable-alpine as production-stage

# Nginx 설정 파일 복사
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물 복사
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

