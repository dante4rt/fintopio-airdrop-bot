FROM node:20.12-alpine3.19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Copy rest code
COPY . .

# Run the application with argument 2
CMD ["npm", "start", "--", "2"]
