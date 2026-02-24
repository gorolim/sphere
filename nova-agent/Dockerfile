FROM node:20-slim

# Install OpenClaw globally
RUN npm install -g openclaw

WORKDIR /app

# Copy agent config files
COPY package.json openclaw.json SOUL.md AGENTS.md ./

# Use a shell wrapper so Railway PORT environment variable injection works
CMD ["sh", "-c", "openclaw serve --workspace . --port ${PORT:-18789} --host 0.0.0.0"]
