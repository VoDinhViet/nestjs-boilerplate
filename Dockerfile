##################
# BUILD BASE IMAGE
##################

FROM node:20-alpine AS base

# Install and use pnpm
RUN npm install -g pnpm

#############################
# BUILD FOR LOCAL DEVELOPMENT
#############################

FROM base as development
WORKDIR /app

# Copy only necessary files for dependency installation
COPY package*.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies)
RUN pnpm install

# Copy the rest of the application source code
COPY . .

# Use the node user from the image (instead of the root user)
USER node

#####################
# BUILD BUILDER IMAGE
#####################

FROM base as builder
WORKDIR /app

# Copy package files and install dependencies from development stage
COPY --from=development /app/node_modules ./node_modules
COPY package*.json pnpm-lock.yaml ./

# Copy application source code
COPY . .

# Build the application
RUN pnpm build

# Remove unnecessary packages and install only production dependencies
ENV NODE_ENV production
RUN pnpm prune --prod

USER node

######################
# BUILD FOR PRODUCTION
######################

FROM node:20-alpine AS production
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

USER node

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
