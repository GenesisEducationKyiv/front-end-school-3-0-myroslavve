# Use Alpine Node.js as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Create data directories
RUN mkdir -p data/tracks data/uploads

# Copy initial data if it exists
RUN if [ -d "./data-initial" ]; then cp -r ./data-initial/* ./data/ || true; fi

# Expose port 8000
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=development
ENV PORT=8000
ENV HOST=0.0.0.0

# Start the development server
CMD ["npm", "run", "dev"] 