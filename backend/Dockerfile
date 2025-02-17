# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

# (Optional) If you want to include your local .env file,
# uncomment the next line. Note: Be cautious with secrets.
COPY .env ./

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables (can also be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["npm", "start"]
