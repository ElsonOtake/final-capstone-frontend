# final-capstone-frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* yarn.lock* ./
RUN npm install

COPY . .

EXPOSE 3001

# Starts the React development server
CMD ["npm", "start"]
