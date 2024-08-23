# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the Docker image
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm cache clean --force && rm -rf node_modules && npm install

# Copy the application files to the working directory
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
