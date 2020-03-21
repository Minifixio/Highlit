FROM node:12

#COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/src/app/

# API files
COPY csgo_highlights_server

# Copy Angular build 
COPY highlightsCSGO/dist ./dist/
