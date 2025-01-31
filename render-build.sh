#!/bin/bash

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Start the server
node server.js