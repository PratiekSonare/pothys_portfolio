# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create uploads directory if it doesn't exist
RUN mkdir -p uploads

# Expose the port (adjust if your backend uses a different port)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
