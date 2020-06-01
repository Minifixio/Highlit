FROM node:12

#COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/src/app/

# API files
COPY server server

# Copy Angular build 
# COPY client-angular/dist ./dist/
