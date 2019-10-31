# Base image
FROM  node:10

# Port the app will run on(only needed when data is server, not in this case)
EXPOSE 8080

# Copy package json files(files change less frequently then source code)
COPY package*.json /redis-app/

#cd into app location
WORKDIR /redis-app

#Install dependencies
RUN npm install

#Copy the rest of files (when files are edited this is the image layer that will be rebuilt)
COPY . .

#Start app when container is up
CMD ["npm", "start"]