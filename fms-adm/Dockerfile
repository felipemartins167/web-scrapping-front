# Usa uma imagem Node.js oficial como base
FROM node:18

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Instala o Angular CLI globalmente
RUN npm install -g @angular/cli@18

# Copia os arquivos de dependências para o contêiner
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código para o contêiner
COPY . .

# Expõe a porta padrão do Angular (4200)
EXPOSE 4200

# Comando para iniciar a aplicação
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]