# Étape 1 - Build du projet avec Vite
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json bun.lockb ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 - Servir avec nginx
FROM nginx:alpine

# Copie le build dans nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Supprimer le fichier config par défaut et ajouter le tien
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
