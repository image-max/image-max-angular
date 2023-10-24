FROM node:16-bullseye

# update installed packages
RUN apt-get update -y

# Add System Utilities
RUN apt-get install -y procps libxss1 unzip sudo

# Install Chrome
RUN apt-get install -y chromium

# Add node user to suto list
RUN adduser node sudo

# Install AWS CLI
RUN wget -O awscliv2.zip https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip \
    && unzip awscliv2.zip \
    && sudo ./aws/install

# Install Serverless globally
RUN npm i -g serverless@3

# docker build -t fractex/bullseye-node16-py3-chrome-aws-serverless .