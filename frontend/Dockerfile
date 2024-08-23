# Use an official nginx image to serve static files
FROM nginx:alpine

# Copy static files to nginx
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to start nginx
CMD ["nginx", "-g", "daemon off;"]
