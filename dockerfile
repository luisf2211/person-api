# ==== STAGE 1: BUILD ====
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Compilar el proyecto
RUN npm run build

# ==== STAGE 2: RUNTIME ====
FROM node:20-alpine

WORKDIR /app

# Copiar la app compilada y node_modules desde el builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copiar certificados (ajusta si tienes más o cambian de nombre)
COPY cert ./ssl

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3001

# Exponer el puerto
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]
