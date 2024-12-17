# Stage 1: Build the React app
# Use the official Node.js 20.15.1 image to build the app
FROM node:20.15.1 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install dependencies without generating node_modules
RUN npm i

# Copy the rest of your application code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the app using Nginx
# Use Nginx as the base image for serving the built app
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
