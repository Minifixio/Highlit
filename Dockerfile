FROM node:12

RUN npm install pm2 -g

# COPY server /home/node/app/

# RUN cd /home/node/app && npm install && mkdir logs

# CMD ["pm2-runtime", "build/app.js"]