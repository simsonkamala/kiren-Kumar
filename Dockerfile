# 1. Use official Node.js base image
FROM node:22.11.0-slim

# 2. Install dependencies required by Chrome + fonts
RUN apt-get update && apt-get install -y \
  wget \
  gnupg \
  ca-certificates \
  fonts-liberation \
  fonts-roboto \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libnspr4 \
  libnss3 \
  libxss1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libu2f-udev \
  libvulkan1 \
  libxcb-dri3-0 \
  --no-install-recommends

# 3. Add Google Chrome repo and install it
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 4. Set working directory
WORKDIR /app

# 5. Copy your app files
COPY . .

# 6. Install dependencies
RUN npm install

# 7. Set Puppeteer executable path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 8. Expose app port
EXPOSE 1234

# 9. Start the app
CMD ["node", "src/main.js"]