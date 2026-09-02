FROM node:20-alpine

#Creates a new working directory
WORKDIR /app  

COPY package.json package.json
RUN npm install

#Copies entire directory into the container and overwrites the existing file or directory.
COPY . . 

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

