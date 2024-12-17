# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build TypeScript files
RUN npm run build

# Expose the backend port
EXPOSE 8080

# Start the server
CMD ["node", "dist/index.js"]